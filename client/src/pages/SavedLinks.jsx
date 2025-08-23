import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Search, Filter, SortAsc, SortDesc, BookmarkCheck } from 'lucide-react'
import { toast } from 'react-hot-toast'
import LinkCard from '../components/LinkCard'
import { api } from '../lib/api'
import { useAuth } from '../contexts/AuthContext'

const SavedLinks = () => {
  const { user } = useAuth()
  const [links, setLinks] = useState([])
  const [filteredLinks, setFilteredLinks] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedTag, setSelectedTag] = useState('')
  const [sortOrder, setSortOrder] = useState('newest')
  const [availableTags, setAvailableTags] = useState([])

  const fetchLinks = async () => {
    try {
      if (!user) {
        setLinks([])
        setIsLoading(false)
        return
      }

      setIsLoading(true)
      const response = await api.get('/links', {
        params: {
          q: searchTerm || undefined,
          tag: selectedTag || undefined,
          sort: sortOrder
        }
      })
      setLinks(response.data)
    } catch (error) {
      console.error('Error fetching links:', error)
      if (error.response?.status === 401) {
        console.log('User not authenticated, clearing links')
        setLinks([])
      } else {
        toast.error('Failed to load links')
      }
    } finally {
      setIsLoading(false)
    }
  }

  const fetchTags = async () => {
    try {
      if (!user) {
        setAvailableTags([])
        return
      }

      const response = await api.get('/links/tags')
      setAvailableTags(response.data)
    } catch (error) {
      console.error('Error fetching tags:', error)
    }
  }

  useEffect(() => {
    if (user) {
      fetchLinks()
      fetchTags()
    }
  }, [searchTerm, selectedTag, sortOrder, user])

  useEffect(() => {
    setFilteredLinks(links)
  }, [links])

  const handleDeleteLink = async (linkId) => {
    try {
      await api.delete(`/links/${linkId}`)
      setLinks(links.filter(link => link._id !== linkId))
      toast.success('Link deleted successfully')
    } catch (error) {
      console.error('Error deleting link:', error)
      throw error
    }
  }

  const handleUpdateLink = async (linkId, data) => {
    try {
      const response = await api.patch(`/links/${linkId}`, data)
      setLinks(links.map(link => link._id === linkId ? response.data : link))
      // Refresh tags if tag was changed
      fetchTags()
    } catch (error) {
      console.error('Error updating link:', error)
      throw error
    }
  }

  const clearFilters = () => {
    setSearchTerm('')
    setSelectedTag('')
    setSortOrder('newest')
  }

  return (
    <motion.div
      className="min-h-screen pt-20 px-4 sm:px-6 lg:px-8 pb-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          className="text-center mb-8"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <BookmarkCheck className="w-16 h-16 text-netflix-red mx-auto mb-4" />
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Saved Links</h1>
          <p className="text-netflix-lightGray">
            Browse and manage your entire Instagram collection
          </p>
        </motion.div>

        {/* Filters */}
        <motion.div
          className="bg-netflix-gray rounded-lg p-6 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-netflix-lightGray" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search captions..."
                className="netflix-input w-full pl-10"
              />
            </div>

            {/* Tag Filter */}
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-netflix-lightGray" />
              <select
                value={selectedTag}
                onChange={(e) => setSelectedTag(e.target.value)}
                className="netflix-input w-full pl-10 appearance-none"
              >
                <option value="">All Categories</option>
                {availableTags.map(tag => (
                  <option key={tag} value={tag}>{tag}</option>
                ))}
              </select>
            </div>

            {/* Sort Order */}
            <div className="relative">
              {sortOrder === 'newest' ? (
                <SortDesc className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-netflix-lightGray" />
              ) : (
                <SortAsc className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-netflix-lightGray" />
              )}
              <select
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value)}
                className="netflix-input w-full pl-10 appearance-none"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
              </select>
            </div>

            {/* Clear Filters */}
            <button
              onClick={clearFilters}
              className="netflix-button"
            >
              Clear Filters
            </button>
          </div>

          {/* Active Filters Display */}
          {(searchTerm || selectedTag) && (
            <div className="mt-4 flex flex-wrap gap-2">
              {searchTerm && (
                <span className="bg-netflix-red px-3 py-1 rounded-full text-sm">
                  Search: "{searchTerm}"
                </span>
              )}
              {selectedTag && (
                <span className="bg-netflix-red px-3 py-1 rounded-full text-sm">
                  Category: {selectedTag}
                </span>
              )}
            </div>
          )}
        </motion.div>

        {/* Results */}
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <motion.div
              className="w-8 h-8 border-4 border-netflix-red border-t-transparent rounded-full"
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            />
          </div>
        ) : filteredLinks.length === 0 ? (
          <motion.div
            className="text-center py-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <BookmarkCheck className="w-16 h-16 text-netflix-lightGray mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">No links found</h3>
            <p className="text-netflix-lightGray">
              {searchTerm || selectedTag 
                ? 'Try adjusting your filters to find what you\'re looking for.'
                : 'You haven\'t saved any links yet. Start building your collection!'
              }
            </p>
          </motion.div>
        ) : (
          <>
            {/* Results Count */}
            <div className="mb-6">
              <p className="text-netflix-lightGray">
                {filteredLinks.length} {filteredLinks.length === 1 ? 'link' : 'links'} found
              </p>
            </div>

            {/* Links Grid */}
            <motion.div
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              {filteredLinks.map((link, index) => (
                <motion.div
                  key={link._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <LinkCard
                    link={link}
                    onDelete={handleDeleteLink}
                    onUpdate={handleUpdateLink}
                  />
                </motion.div>
              ))}
            </motion.div>
          </>
        )}
      </div>
    </motion.div>
  )
}

export default SavedLinks