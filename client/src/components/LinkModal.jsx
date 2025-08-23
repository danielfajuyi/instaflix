import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Save, ExternalLink, Copy, Trash2 } from 'lucide-react'
import { toast } from 'react-hot-toast'
import InstagramEmbed from './InstagramEmbed'

const LinkModal = ({ link, onClose, onUpdate, onDelete }) => {
  const [caption, setCaption] = useState(link.caption || '')
  const [tag, setTag] = useState(link.tag || '')
  const [isUpdating, setIsUpdating] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  const defaultTags = ['Hotel', 'Clothing Brand', 'Graphic Design', 'Web Design', 'Food', 'Travel', 'Fitness', 'Inspiration']

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [])

  const handleUpdate = async () => {
    setIsUpdating(true)
    try {
      await onUpdate(link._id, { caption, tag })
      toast.success('Link updated successfully')
      onClose()
    } catch (error) {
      toast.error('Failed to update link')
    } finally {
      setIsUpdating(false)
    }
  }

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this link?')) {
      setIsDeleting(true)
      try {
        await onDelete(link._id)
        toast.success('Link deleted successfully')
        onClose()
      } catch (error) {
        toast.error('Failed to delete link')
        setIsDeleting(false)
      }
    }
  }

  const handleCopyLink = () => {
    navigator.clipboard.writeText(link.url)
    toast.success('Link copied to clipboard!')
  }

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        {/* Backdrop */}
        <motion.div
          className="absolute inset-0 bg-black bg-opacity-80 backdrop-blur-sm"
          onClick={onClose}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        />

        {/* Modal Content */}
        <motion.div
          className="relative bg-netflix-gray rounded-lg shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-600">
            <h2 className="text-xl font-semibold">Edit Link</h2>
            <div className="flex items-center space-x-2">
              <button
                onClick={handleCopyLink}
                className="p-2 text-netflix-lightGray hover:text-white hover:bg-netflix-black rounded-md transition-colors"
                title="Copy link"
              >
                <Copy className="w-5 h-5" />
              </button>
              <button
                onClick={() => window.open(link.url, '_blank')}
                className="p-2 text-netflix-lightGray hover:text-white hover:bg-netflix-black rounded-md transition-colors"
                title="Open in new tab"
              >
                <ExternalLink className="w-5 h-5" />
              </button>
              <button
                onClick={onClose}
                className="p-2 text-netflix-lightGray hover:text-white hover:bg-netflix-black rounded-md transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6 p-6">
            {/* Instagram Embed */}
            <div>
              <InstagramEmbed url={link.url} className="w-full" />
            </div>

            {/* Edit Form */}
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-netflix-lightGray mb-2">
                  Caption
                </label>
                <textarea
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  className="netflix-input w-full h-24 resize-none"
                  placeholder="Add a caption..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-netflix-lightGray mb-2">
                  Tag/Category
                </label>
                <div className="space-y-3">
                  <input
                    type="text"
                    value={tag}
                    onChange={(e) => setTag(e.target.value)}
                    className="netflix-input w-full"
                    placeholder="Enter custom tag or select from below"
                  />
                  <div className="flex flex-wrap gap-2">
                    {defaultTags.map((defaultTag) => (
                      <button
                        key={defaultTag}
                        onClick={() => setTag(defaultTag)}
                        className={`px-3 py-1 text-xs rounded-full transition-colors ${
                          tag === defaultTag
                            ? 'bg-netflix-red text-white'
                            : 'bg-netflix-black text-netflix-lightGray hover:bg-netflix-red hover:text-white'
                        }`}
                      >
                        {defaultTag}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="text-xs text-netflix-lightGray">
                <p><strong>URL:</strong> {link.url}</p>
                <p><strong>Created:</strong> {new Date(link.createdAt).toLocaleString()}</p>
              </div>

              {/* Actions */}
              <div className="flex space-x-3 pt-4">
                <button
                  onClick={handleUpdate}
                  disabled={isUpdating || !tag.trim()}
                  className="flex items-center space-x-2 netflix-button flex-1 disabled:opacity-50"
                >
                  <Save className="w-4 h-4" />
                  <span>{isUpdating ? 'Saving...' : 'Save Changes'}</span>
                </button>
                <button
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="flex items-center space-x-2 bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-6 rounded transition-all duration-200 disabled:opacity-50"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>{isDeleting ? 'Deleting...' : 'Delete'}</span>
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

export default LinkModal