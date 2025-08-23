import React, { useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import { gsap } from 'gsap'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import LinkCard from './LinkCard'

const NetflixRow = ({ title, links, onDelete, onUpdate }) => {
  const rowRef = useRef(null)
  const scrollContainerRef = useRef(null)

  useEffect(() => {
    // GSAP scroll animations
    const cards = rowRef.current?.querySelectorAll('.netflix-card')
    if (cards) {
      gsap.fromTo(cards, 
        { opacity: 0, y: 50 },
        { 
          opacity: 1, 
          y: 0, 
          duration: 0.6, 
          stagger: 0.1,
          ease: "power2.out"
        }
      )
    }
  }, [links])

  const scroll = (direction) => {
    const container = scrollContainerRef.current
    if (!container) return

    const scrollAmount = container.clientWidth * 0.8
    container.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth'
    })
  }

  if (!links || links.length === 0) return null

  return (
    <motion.section
      className="mb-12"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl md:text-3xl font-bold mb-6 text-white">{title}</h2>
        
        <div className="relative group">
          {/* Scroll Buttons */}
          <button
            onClick={() => scroll('left')}
            className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10 bg-black bg-opacity-50 hover:bg-opacity-75 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          
          <button
            onClick={() => scroll('right')}
            className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10 bg-black bg-opacity-50 hover:bg-opacity-75 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          {/* Scrollable Container */}
          <div 
            ref={scrollContainerRef}
            className="flex space-x-4 overflow-x-auto row-scroll pb-4"
          >
            <div ref={rowRef} className="flex space-x-4">
              {links.map((link) => (
                <div key={link._id} className="flex-shrink-0 w-72">
                  <LinkCard 
                    link={link} 
                    onDelete={onDelete}
                    onUpdate={onUpdate}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </motion.section>
  )
}

export default NetflixRow