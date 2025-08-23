import { body } from 'express-validator'

// Validation for creating a new link
export const validateCreateLink = [
  body('url')
    .notEmpty()
    .withMessage('URL is required')
    .isURL()
    .withMessage('Must be a valid URL')
    .matches(/^https?:\/\/(www\.)?instagram\.com\/(p|reel)\/[A-Za-z0-9_-]+/)
    .withMessage('Must be a valid Instagram post or reel URL'),
    
  body('caption')
    .optional()
    .isLength({ max: 1000 })
    .withMessage('Caption must not exceed 1000 characters'),
    
  body('tag')
    .notEmpty()
    .withMessage('Tag is required')
    .isLength({ min: 1, max: 50 })
    .withMessage('Tag must be between 1 and 50 characters')
    .trim()
]

// Validation for updating a link
export const validateUpdateLink = [
  body('caption')
    .optional()
    .isLength({ max: 1000 })
    .withMessage('Caption must not exceed 1000 characters'),
    
  body('tag')
    .optional()
    .notEmpty()
    .withMessage('Tag cannot be empty')
    .isLength({ min: 1, max: 50 })
    .withMessage('Tag must be between 1 and 50 characters')
    .trim()
]