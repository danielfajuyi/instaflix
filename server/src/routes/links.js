import express from 'express'
import {
  getLinks,
  getGroupedLinks,
  getLinkById,
  createLink,
  updateLink,
  deleteLink,
  getTags
} from '../controllers/linkController.js'
import {
  validateCreateLink,
  validateUpdateLink
} from '../middleware/validation.js'
import { authenticateUser } from '../middleware/auth.js'

const router = express.Router()

// Apply authentication middleware to all routes
router.use(authenticateUser)

// GET /api/links - Get all links with optional filtering
router.get('/', getLinks)

// GET /api/links/grouped - Get links grouped by tag (for Netflix rows)
router.get('/grouped', getGroupedLinks)

// GET /api/links/tags - Get unique tags
router.get('/tags', getTags)

// GET /api/links/:id - Get single link
router.get('/:id', getLinkById)

// POST /api/links - Create new link
router.post('/', validateCreateLink, createLink)

// PATCH /api/links/:id - Update link
router.patch('/:id', validateUpdateLink, updateLink)

// DELETE /api/links/:id - Delete link
router.delete('/:id', deleteLink)

export default router