import mongoose from 'mongoose'

const linkSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    index: true
  },
  url: {
    type: String,
    required: true,
    validate: {
      validator: function(v) {
        return /^https?:\/\/(www\.)?instagram\.com\/(p|reel)\/[A-Za-z0-9_-]+/.test(v)
      },
      message: 'Please enter a valid Instagram post or reel URL'
    }
  },
  caption: {
    type: String,
    maxlength: 1000,
    default: ''
  },
  tag: {
    type: String,
    required: true,
    maxlength: 50,
    trim: true
  },
  provider: {
    type: String,
    default: 'instagram'
  },
  embedHtml: {
    type: String,
    default: null
  },
  metadata: {
    title: String,
    description: String,
    thumbnail: String
  }
}, {
  timestamps: true
})

// Index for better query performance
linkSchema.index({ userId: 1, tag: 1, createdAt: -1 })
linkSchema.index({ userId: 1, createdAt: -1 })
linkSchema.index({ caption: 'text' })

// Normalize URL before saving
linkSchema.pre('save', function(next) {
  // Normalize Instagram URL
  this.url = this.url.replace(/\?.*$/, '') // Remove query parameters
  
  // Ensure URL ends with /
  if (!this.url.endsWith('/')) {
    this.url += '/'
  }
  
  next()
})

// Virtual for formatted creation date
linkSchema.virtual('formattedDate').get(function() {
  return this.createdAt.toLocaleDateString()
})

// Ensure virtual fields are serialized
linkSchema.set('toJSON', {
  virtuals: true,
  transform: function(doc, ret) {
    delete ret.__v
    return ret
  }
})

export default mongoose.model('Link', linkSchema)