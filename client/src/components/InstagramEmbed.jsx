import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Loader2, AlertCircle } from "lucide-react";

const InstagramEmbed = ({ url, className = "" }) => {
  const embedRef = useRef(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const processEmbed = async () => {
      if (!url || !embedRef.current) return;

      try {
        setIsLoading(true);
        setHasError(false);

        // Clear previous content
        embedRef.current.innerHTML = "";

        // Create blockquote element for Instagram embed
        const blockquote = document.createElement("blockquote");
        blockquote.className = "instagram-media";
        blockquote.setAttribute("data-instgrm-captioned", "");
        blockquote.setAttribute("data-instgrm-permalink", url);
        blockquote.setAttribute("data-instgrm-version", "14");

        embedRef.current.appendChild(blockquote);

        // Process the embed
        if (window.instgrm && window.instgrm.Embeds) {
          await window.instgrm.Embeds.process();
        }

        // When finished → mark loading as false
        setIsLoading(false);
      } catch (error) {
        console.error("Error processing Instagram embed:", error);
        setHasError(true);
        setIsLoading(false);
      }
    };

    const timer = setTimeout(processEmbed, 100);
    return () => clearTimeout(timer);
  }, [url]);

  if (hasError) {
    return (
      <div
        className={`flex flex-col items-center justify-center p-8 bg-netflix-gray rounded-lg ${className}`}
      >
        <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
        <p className="text-netflix-lightGray text-center">
          Failed to load Instagram post
        </p>
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-2 text-netflix-red hover:underline"
        >
          View on Instagram
        </a>
      </div>
    );
  }

  return (
    <div className={`relative ${className}`}>
      {/* Loader while embed loads */}
      {isLoading && (
        <motion.div
          className="absolute inset-0 flex items-center justify-center bg-netflix-gray rounded-lg z-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <Loader2 className="w-8 h-8 animate-spin text-netflix-red" />
        </motion.div>
      )}

      {/* Instagram player renders here */}
      <div
        ref={embedRef}
        className="instagram-embed-container"
        style={{ minHeight: isLoading ? "400px" : "auto" }}
      />

      {/* Scoped CSS fix for embeds */}
      <style jsx>{`
        .instagram-embed-container {
          max-width: 100% !important;
          overflow: hidden;
          border-radius: 0.75rem; /* match your card rounding */
        }
        .instagram-embed-container iframe {
          max-width: 100% !important;
          width: 100% !important;
          border-radius: 0.75rem; /* rounded corners for iframe */
        }
      `}</style>
    </div>
  );
};

export default InstagramEmbed;
