import React, { createContext, useContext, useEffect, useState } from 'react'
import { getCurrentUser } from '../lib/auth'

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
    const initAuth = async () => {
      // Check for token in URL (Google OAuth callback)
      const params = new URLSearchParams(window.location.search);
      const tokenFromUrl = params.get('token');

      if (tokenFromUrl) {
        localStorage.setItem('token', tokenFromUrl);
        // Clean URL
        window.history.replaceState({}, document.title, window.location.pathname);
      }

      // Check for existing token and load user
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const user = await getCurrentUser();
          if (user) {
            setUser(user);
          } else {
            // Token invalid
            localStorage.removeItem('token');
          }
        } catch (error) {
          console.error("Failed to load user", error);
        }
      }
      
      setLoading(false);
    };

    initAuth();
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