import React, { createContext, useContext, useEffect, useState } from 'react'
import { supabase, getCurrentUser, onAuthStateChange } from '../lib/auth'

const AuthContext = createContext({})

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Get initial user
    getCurrentUser().then((user) => {
      setUser(user)
      setLoading(false)
    })

    // Listen for auth changes
    const { data: { subscription } } = onAuthStateChange((event, session) => {
      setUser(session?.user ?? null)
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  const value = {
    user,
    loading,
    signUp: async (email, password) => {
      const { signUp } = await import('../lib/auth')
      return signUp(email, password)
    },
    signIn: async (email, password) => {
      const { signIn } = await import('../lib/auth')
      return signIn(email, password)
    },
    signInWithGoogle: async () => {
      const { signInWithGoogle } = await import('../lib/auth')
      return signInWithGoogle()
    },
    signOut: async () => {
      const { signOut } = await import('../lib/auth')
      return signOut()
    }
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}