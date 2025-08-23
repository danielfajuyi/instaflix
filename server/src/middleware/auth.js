import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase environment variables')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

export const authenticateUser = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'No token provided'
      })
    }

    const token = authHeader.substring(7) // Remove 'Bearer ' prefix

    // Verify the JWT token with Supabase
    const { data: { user }, error } = await supabase.auth.getUser(token)

    if (error || !user) {
      console.error('Auth error:', error)
      return res.status(401).json({
        success: false,
        message: 'Invalid or expired token'
      })
    }

    // Add user info to request object - CRITICAL: Use user.id for database queries
    req.user = {
      id: user.id,  // This is the Supabase user ID that should be used in database
      email: user.email,
      metadata: user.user_metadata || {}
    }

    console.log('Authenticated user:', req.user.id) // Debug log
    next()
  } catch (error) {
    console.error('Auth middleware error:', error)
    return res.status(401).json({
      success: false,
      message: 'Authentication failed'
    })
  }
}

// Optional middleware for routes that work with or without auth
export const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization
    
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7)
      
      const { data: { user }, error } = await supabase.auth.getUser(token)
      
      if (!error && user) {
        req.user = {
          id: user.id,
          email: user.email,
          metadata: user.user_metadata || {}
        }
      }
    }
    
    next()
  } catch (error) {
    // Continue without auth if there's an error
    next()
  }
}