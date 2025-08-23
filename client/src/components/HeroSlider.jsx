import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Info, ChevronLeft, ChevronRight } from "lucide-react";
import InstagramEmbed from "./InstagramEmbed";

const HeroSlider = ({ links, onLinkClick }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  // Auto-slide functionality
  useEffect(() => {
    if (!isAutoPlaying || links.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % links.length);
    }, 9000);

    return () => clearInterval(interval);
  }, [isAutoPlaying, links.length]);

  const goToSlide = (index) => {
    setCurrentIndex(index);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 10000); // Resume auto-play after 10s
  };

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % links.length);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + links.length) % links.length);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  if (!links || links.length === 0) return null;

  const currentLink = links[currentIndex];

  return (
    <div className="relative h-[80vh] overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          className="absolute inset-0"
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ duration: 1.2 }}
        >
          {/* Background Image/Embed */}
          <div className="absolute inset-0">
            <InstagramEmbed
              url={currentLink.url}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black via-black/50 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-t from-netflix-black via-transparent to-transparent" />
          </div>

          {/* Content */}
          <div className="absolute inset-0 flex items-center">
            <div className="px-4 sm:px-6 lg:px-8 max-w-2xl">
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                <span className="inline-block bg-netflix-red text-white px-3 py-1 rounded-full text-sm font-medium mb-4">
                  {currentLink.tag}
                </span>

                <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 leading-tight">
                  Latest Collection
                </h1>

                {currentLink.caption && (
                  <p className="text-lg md:text-xl text-gray-300 mb-8 line-clamp-3">
                    {currentLink.caption}
                  </p>
                )}

                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => onLinkClick(currentLink)}
                    className="flex items-center space-x-2 bg-white text-black px-8 py-3 rounded-md font-semibold hover:bg-gray-200 transition-colors"
                  >
                    <Play className="w-5 h-5 fill-current" />
                    <span>View Post</span>
                  </button>

                  <button
                    onClick={() => onLinkClick(currentLink)}
                    className="flex items-center space-x-2 bg-gray-600 bg-opacity-70 text-white px-8 py-3 rounded-md font-semibold hover:bg-opacity-90 transition-colors"
                  >
                    <Info className="w-5 h-5" />
                    <span>More Info</span>
                  </button>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation Arrows */}
      {links.length > 1 && (
        <>
          <button
            onClick={prevSlide}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 hover:bg-opacity-75 text-white p-3 rounded-full transition-all z-10"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          <button
            onClick={nextSlide}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 hover:bg-opacity-75 text-white p-3 rounded-full transition-all z-10"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </>
      )}

      {/* Slide Indicators */}
      {links.length > 1 && (
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-2">
          {links.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-3 h-3 rounded-full transition-all ${
                index === currentIndex
                  ? "bg-white"
                  : "bg-white bg-opacity-50 hover:bg-opacity-75"
              }`}
            />
          ))}
        </div>
      )}

      {/* Auto-play indicator */}
      {isAutoPlaying && links.length > 1 && (
        <div className="absolute top-4 right-4 bg-black bg-opacity-50 text-white px-3 py-1 rounded-full text-sm">
          Auto-playing
        </div>
      )}
    </div>
  );
};

export default HeroSlider;
