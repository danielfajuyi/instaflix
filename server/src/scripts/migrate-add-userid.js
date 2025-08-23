import mongoose from 'mongoose'
import dotenv from 'dotenv'
import Link from '../models/Link.js'

dotenv.config()

async function migrateAddUserId() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI)
    console.log('Connected to MongoDB')

    // Find all links without userId
    const linksWithoutUserId = await Link.find({ userId: { $exists: false } })
    console.log(`Found ${linksWithoutUserId.length} links without userId`)

    if (linksWithoutUserId.length === 0) {
      console.log('No migration needed - all links already have userId')
      return
    }

    // For existing links, you'll need to assign them to a default user
    // or delete them. For this example, we'll assign to a placeholder user ID
    const defaultUserId = 'migration-user-placeholder'
    
    console.log(`Assigning ${linksWithoutUserId.length} links to placeholder user: ${defaultUserId}`)
    console.log('⚠️  WARNING: You should update these links with real user IDs after migration')

    const result = await Link.updateMany(
      { userId: { $exists: false } },
      { $set: { userId: defaultUserId } }
    )

    console.log(`✅ Migration completed: ${result.modifiedCount} links updated`)
    console.log('\n📝 Next steps:')
    console.log('1. Update the placeholder user IDs with real Supabase user IDs')
    console.log('2. Or delete the placeholder links if they\'re not needed')
    console.log(`3. Query: db.links.find({userId: "${defaultUserId}"})`)

  } catch (error) {
    console.error('Migration error:', error)
  } finally {
    await mongoose.disconnect()
    console.log('Disconnected from MongoDB')
  }
}

// Run the migration
migrateAddUserId()