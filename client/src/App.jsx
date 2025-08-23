import React from 'react'
import { Routes, Route } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { AuthProvider } from './contexts/AuthContext'
import Header from './components/Header'
import Home from './pages/Home'
import AddLink from './pages/AddLink'
import SavedLinks from './pages/SavedLinks'

function App() {
  return (
    <AuthProvider>
    <div className="min-h-screen bg-netflix-black text-white">
      <Header />
      <AnimatePresence mode="wait">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/add" element={<AddLink />} />
          <Route path="/saved" element={<SavedLinks />} />
        </Routes>
      </AnimatePresence>
    </div>
    </AuthProvider>
  )
}

export default App