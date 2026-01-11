import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import User from '../models/User.js';

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: '/api/auth/google/callback',
      proxy: true
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // 1. Check if user already exists with this Google ID
        const existingUser = await User.findOne({ googleId: profile.id });
        if (existingUser) {
          return done(null, existingUser);
        }

        // 2. Check if user exists with the same email (account linking)
        const existingEmailUser = await User.findOne({ email: profile.emails[0].value });
        if (existingEmailUser) {
          // Link Google account to existing email account
          existingEmailUser.googleId = profile.id;
          if (!existingEmailUser.avatar) existingEmailUser.avatar = profile.photos[0].value;
          await existingEmailUser.save();
          return done(null, existingEmailUser);
        }

        // 3. Create new user
        const newUser = await User.create({
          googleId: profile.id,
          email: profile.emails[0].value,
          username: profile.displayName.replace(/\s+/g, '').toLowerCase() + Math.random().toString(36).slice(-4),
          avatar: profile.photos[0].value
        });
        
        done(null, newUser);
      } catch (err) {
        done(err, null);
      }
    }
  )
);

export default passport;
