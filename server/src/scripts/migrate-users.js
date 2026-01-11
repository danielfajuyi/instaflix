import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { createClient } from '@supabase/supabase-js';
import User from '../models/User.js';
import Link from '../models/Link.js';
import path from 'path';
import { fileURLToPath } from 'url';

// Load env vars
const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '../../.env') });

const migrateUsers = async () => {
  try {
    // 1. Connect to MongoDB
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // 2. Connect to Supabase
    console.log('Connecting to Supabase...');
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    
    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error('Supabase credentials missing in .env');
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    });

    // 3. Fetch all users from Supabase
    // Note: listUsers defaults to 50 users per page. Pagination needed for large user bases.
    console.log('Fetching users from Supabase...');
    const { data: { users }, error } = await supabase.auth.admin.listUsers();

    if (error) throw error;
    console.log(`Found ${users.length} users in Supabase`);

    // 4. Migrate each user
    let migratedCount = 0;
    let errorCount = 0;

    for (const sbUser of users) {
      try {
        const { id: supabaseId, email, user_metadata } = sbUser;
        const username = user_metadata?.username || email.split('@')[0];
        const avatar = user_metadata?.avatar || user_metadata?.avatar_url || '';

        // Check if user already exists in Mongo
        let mongoUser = await User.findOne({ 
          $or: [{ supabaseId }, { email }]
        });

        if (!mongoUser) {
          console.log(`Creating user: ${email}`);
          mongoUser = await User.create({
            email,
            username: username + '_' + Math.random().toString(36).substr(2, 4), // Ensure uniqueness
            supabaseId,
            avatar,
            // Temporary password for migrated users (they should reset or use Google)
            password: Math.random().toString(36), 
            googleId: user_metadata?.sub || undefined // If they signed in with Google on Supabase
          });
        } else {
          console.log(`User already exists, updating Supabase ID: ${email}`);
          mongoUser.supabaseId = supabaseId;
          if (!mongoUser.googleId && user_metadata?.sub) {
            mongoUser.googleId = user_metadata.sub;
          }
          await mongoUser.save();
        }

        // 5. Update Links to point to new Mongo ID
        const result = await Link.updateMany(
          { userId: supabaseId },
          { userId: mongoUser._id.toString() }
        );
        
        console.log(`Updated ${result.modifiedCount} links for user ${email}`);
        migratedCount++;

      } catch (err) {
        console.error(`Failed to migrate user ${sbUser.email}:`, err.message);
        errorCount++;
      }
    }

    console.log(`Migration complete. Migrated: ${migratedCount}, Errors: ${errorCount}`);
    process.exit(0);

  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
};

migrateUsers();
