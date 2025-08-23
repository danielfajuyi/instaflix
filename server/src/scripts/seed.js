import mongoose from 'mongoose'
import dotenv from 'dotenv'
import Link from '../models/Link.js'

dotenv.config()

const sampleLinks = [
  {
    url: 'https://www.instagram.com/p/CwXxX123456/',
    caption: 'Beautiful hotel design inspiration from Bali',
    tag: 'Hotel'
  },
  {
    url: 'https://www.instagram.com/p/CwXxX234567/',
    caption: 'Minimalist clothing brand showcase',
    tag: 'Clothing Brand'
  },
  {
    url: 'https://www.instagram.com/p/CwXxX345678/',
    caption: 'Stunning graphic design work',
    tag: 'Graphic Design'
  },
  {
    url: 'https://www.instagram.com/p/CwXxX456789/',
    caption: 'Modern web design portfolio',
    tag: 'Web Design'
  },
  {
    url: 'https://www.instagram.com/p/CwXxX567890/',
    caption: 'Delicious Italian cuisine',
    tag: 'Food'
  },
  {
    url: 'https://www.instagram.com/p/CwXxX678901/',
    caption: 'Travel inspiration from Japan',
    tag: 'Travel'
  },
  {
    url: 'https://www.instagram.com/reel/CwXxX789012/',
    caption: 'Morning fitness routine',
    tag: 'Fitness'
  },
  {
    url: 'https://www.instagram.com/reel/CwXxX890123/',
    caption: 'Daily motivation quote',
    tag: 'Inspiration'
  },
  {
    url: 'https://www.instagram.com/p/CwXxX901234/',
    caption: 'Luxury hotel interior design',
    tag: 'Hotel'
  },
  {
    url: 'https://www.instagram.com/p/CwXxX012345/',
    caption: 'Sustainable fashion brand',
    tag: 'Clothing Brand'
  }
]

async function seedDatabase() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/instagram-crm')
    console.log('Connected to MongoDB')

    // Clear existing links
    await Link.deleteMany({})
    console.log('Cleared existing links')

    // Insert sample links
    const insertedLinks = await Link.insertMany(sampleLinks)
    console.log(`Inserted ${insertedLinks.length} sample links`)

    // Display grouping
    const grouped = await Link.aggregate([
      {
        $group: {
          _id: '$tag',
          count: { $sum: 1 }
        }
      },
      {
        $sort: { _id: 1 }
      }
    ])

    console.log('\nLinks grouped by tag:')
    grouped.forEach(group => {
      console.log(`  ${group._id}: ${group.count} links`)
    })

    console.log('\nDatabase seeded successfully!')
  } catch (error) {
    console.error('Error seeding database:', error)
  } finally {
    await mongoose.disconnect()
    console.log('Disconnected from MongoDB')
  }
}

// Run the seed function
seedDatabase()