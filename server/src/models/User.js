import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    trim: true,
    unique: true,
    sparse: true // Allows null/undefined for OAuth users initially
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    // Password is strict requirement only if googleId is not present
    required: function() { return !this.googleId; }
  },
  googleId: {
    type: String,
    unique: true,
    sparse: true
  },
  avatar: {
    type: String,
    default: ''
  },
  supabaseId: { 
    type: String, 
    unique: true, 
    sparse: true,
    select: false // Don't return this by default
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  }
}, {
  timestamps: true
});

// Index for optimizing lookups
userSchema.index({ email: 1 });
userSchema.index({ googleId: 1 });
userSchema.index({ supabaseId: 1 });

const User = mongoose.model('User', userSchema);
export default User;
