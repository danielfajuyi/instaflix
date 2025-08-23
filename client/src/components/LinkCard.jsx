import React, { useState } from "react";
import { motion } from "framer-motion";
import { ExternalLink, Edit, Trash2, Copy } from "lucide-react";
import { toast } from "react-hot-toast";
import InstagramEmbed from "./InstagramEmbed";
import LinkModal from "./LinkModal";

const LinkCard = ({ link, onDelete, onUpdate }) => {
  const [showModal, setShowModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(link.url);
    toast.success("Link copied to clipboard!");
  };

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this link?")) {
      setIsDeleting(true);
      try {
        await onDelete(link._id);
        toast.success("Link deleted successfully");
      } catch (error) {
        toast.error("Failed to delete link");
        setIsDeleting(false);
      }
    }
  };

  return (
    <>
      <motion.div
        className="netflix-card cursor-pointer relative"
        whileHover={{ scale: 1.05, y: -5 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => setShowModal(true)}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        layout
      >
        <div className="relative">
          <InstagramEmbed url={link.url} className="w-full h-80 object-cover" />

          {/* Overlay with actions */}
          <motion.div
            className="absolute inset-0 bg-black bg-opacity-60 h-[404px] flex items-center justify-center space-x-3 z-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: isHovered ? 1 : 0 }}
            transition={{ duration: 0.3 }}
          >
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleCopyLink();
              }}
              className="p-2 bg-netflix-red rounded-full hover:bg-red-700 transition-colors"
              title="Copy link"
            >
              <Copy className="w-4 h-4" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                window.open(link.url, "_blank");
              }}
              className="p-2 bg-netflix-red rounded-full hover:bg-red-700 transition-colors"
              title="Open in new tab"
            >
              <ExternalLink className="w-4 h-4" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowModal(true);
              }}
              className="p-2 bg-netflix-red rounded-full hover:bg-red-700 transition-colors"
              title="Edit"
            >
              <Edit className="w-4 h-4" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleDelete();
              }}
              disabled={isDeleting}
              className="p-2 bg-red-600 rounded-full hover:bg-red-800 transition-colors disabled:opacity-50"
              title="Delete"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </motion.div>
        </div>

        <div className="relative z-10 p-4">
          {/* Gradient background overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent pointer-events-none"></div>

          <div className="relative">
            <div className="flex items-center justify-between mb-2">
              <span className="bg-netflix-red text-xs px-2 py-1 rounded-full">
                {link.tag}
              </span>
              {/* <span className="text-xs text-netflix-lightGray">
                {new Date(link.createdAt).toLocaleDateString()}
              </span> */}
            </div>

            {link.caption && (
              <p className="text-sm text-netflix-lightGray line-clamp-2">
                {link.caption}
              </p>
            )}
          </div>
        </div>
      </motion.div>

      {showModal && (
        <LinkModal
          link={link}
          onClose={() => setShowModal(false)}
          onUpdate={onUpdate}
          onDelete={onDelete}
        />
      )}
    </>
  );
};

export default LinkCard;
