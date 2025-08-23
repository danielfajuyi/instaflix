import { validationResult } from 'express-validator'
import Link from '../models/Link.js'
import axios from 'axios'

// Get all links with optional filtering, searching, and sorting
export const getLinks = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      })
    }

    const { tag, q, sort = 'newest' } = req.query
    
    // Build query object
    let query = { userId: req.user.id }
    
    if (tag) {
      query.tag = new RegExp(tag, 'i')
    }
    
    if (q) {
      query.caption = new RegExp(q, 'i')
    }
    
    // Build sort object
    let sortObj = {}
    switch (sort) {
      case 'oldest':
        sortObj.createdAt = 1
        break
      case 'newest':
      default:
        sortObj.createdAt = -1
    }
    
    const links = await Link.find(query)
      .sort(sortObj)
      .limit(100) // Reasonable limit
    
    res.json(links)
  } catch (error) {
    console.error('Error fetching links:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to fetch links'
    })
  }
}

// Get links grouped by tag (for Netflix-style rows)
export const getGroupedLinks = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      })
    }

    const links = await Link.find({ userId: req.user.id }).sort({ createdAt: -1 })
    
    // Group links by tag
    const groupedLinks = links.reduce((groups, link) => {
      const tag = link.tag
      if (!groups[tag]) {
        groups[tag] = []
      }
      groups[tag].push(link)
      return groups
    }, {})
    
    res.json(groupedLinks)
  } catch (error) {
    console.error('Error fetching grouped links:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to fetch grouped links'
    })
  }
}

// Get single link by ID
export const getLinkById = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      })
    }

    const link = await Link.findOne({ 
      _id: req.params.id, 
      userId: req.user.id 
    })
    
    if (!link) {
      return res.status(404).json({
        success: false,
        message: 'Link not found'
      })
    }
    
    res.json(link)
  } catch (error) {
    console.error('Error fetching link:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to fetch link'
    })
  }
}

// Create new link
export const createLink = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      })
    }

    // Check validation results
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      })
    }
    
    const { url, caption, tag } = req.body
    
    // Check if URL already exists
    const existingLink = await Link.findOne({ 
      url: url.trim(), 
      userId: req.user.id 
    })
    if (existingLink) {
      return res.status(409).json({
        success: false,
        message: 'This Instagram URL has already been saved'
      })
    }
    
    // Create new link
    const link = new Link({
      userId: req.user.id,
      url: url.trim(),
      caption: caption?.trim() || '',
      tag: tag.trim()
    })
    
    // Optionally fetch oEmbed data
    try {
      const embedData = await fetchInstagramEmbed(url.trim())
      if (embedData) {
        link.embedHtml = embedData.html
        link.metadata = {
          title: embedData.title,
          description: embedData.author_name,
          thumbnail: embedData.thumbnail_url
        }
      }
    } catch (embedError) {
      console.warn('Failed to fetch embed data:', embedError.message)
      // Continue without embed data
    }
    
    await link.save()
    
    res.status(201).json(link)
  } catch (error) {
    console.error('Error creating link:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to create link'
    })
  }
}

// Update link
export const updateLink = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      })
    }

    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      })
    }
    
    const { caption, tag } = req.body
    
    const link = await Link.findByIdAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      {
        caption: caption?.trim() || '',
        tag: tag.trim()
      },
      { new: true, runValidators: true }
    )
    
    if (!link) {
      return res.status(404).json({
        success: false,
        message: 'Link not found'
      })
    }
    
    res.json(link)
  } catch (error) {
    console.error('Error updating link:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to update link'
    })
  }
}

// Delete link
export const deleteLink = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      })
    }

    const link = await Link.findOneAndDelete({ 
      _id: req.params.id, 
      userId: req.user.id 
    })
    
    if (!link) {
      return res.status(404).json({
        success: false,
        message: 'Link not found'
      })
    }
    
    res.json({
      success: true,
      message: 'Link deleted successfully'
    })
  } catch (error) {
    console.error('Error deleting link:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to delete link'
    })
  }
}

// Helper function to fetch Instagram oEmbed data
async function fetchInstagramEmbed(url) {
  try {
    const oembedUrl = `https://graph.facebook.com/v18.0/instagram_oembed?url=${encodeURIComponent(url)}&access_token=${process.env.INSTAGRAM_ACCESS_TOKEN || ''}`
    
    const response = await axios.get(oembedUrl, {
      timeout: 5000,
      headers: {
        'User-Agent': 'Instagram-CRM/1.0'
      }
    })
    
    return response.data
  } catch (error) {
    // Try public oEmbed endpoint as fallback
    try {
      const publicOembedUrl = `https://www.instagram.com/p/oembed/?url=${encodeURIComponent(url)}`
      const response = await axios.get(publicOembedUrl, {
        timeout: 5000,
        headers: {
          'User-Agent': 'Instagram-CRM/1.0'
        }
      })
      return response.data
    } catch (fallbackError) {
      console.warn('Both oEmbed endpoints failed:', error.message, fallbackError.message)
      return null
    }
  }
}

// Get unique tags
export const getTags = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      })
    }

    const tags = await Link.distinct('tag', { userId: req.user.id })
    res.json(tags.sort())
  } catch (error) {
    console.error('Error fetching tags:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to fetch tags'
    })
  }
}