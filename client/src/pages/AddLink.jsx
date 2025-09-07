import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { Link as LinkIcon, Instagram, Tag, MessageCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { api } from "../lib/api";
import { useAuth } from "../contexts/AuthContext";

const AddLink = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [tags, setTags] = useState([]);

  // Static defaults
  const defaultTags = [
    "Hotel",
    "Clothing Brand",
    "Graphic Design",
    "Web Design",
    "Food",
    "Travel",
    "Fitness",
    "Inspiration",
  ];

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
  } = useForm();

  const watchedTag = watch("tag");

  // Fetch tags from DB and merge with defaults
  useEffect(() => {
    const fetchTags = async () => {
      try {
        const res = await api.get("/links/tags");
        const userTags = res.data || [];

        // Merge static + dynamic, remove duplicates
        const merged = Array.from(new Set([...defaultTags, ...userTags]));
        setTags(merged);
      } catch (error) {
        console.error("Failed to fetch tags:", error);
        setTags(defaultTags); // fallback
      }
    };

    if (user) {
      fetchTags();
    } else {
      setTags(defaultTags); // if not logged in
    }
  }, [user]);

  const validateInstagramUrl = (url) => {
    const instagramRegex =
      /^https?:\/\/(www\.)?instagram\.com\/(p|reel)\/[A-Za-z0-9_-]+/;
    return (
      instagramRegex.test(url) ||
      "Please enter a valid Instagram post or reel URL"
    );
  };

  const onSubmit = async (data) => {
    if (!user) {
      toast.error("Please sign in to add links");
      return;
    }

    setIsSubmitting(true);

    try {
      const linkData = {
        url: data.url.trim(),
        caption: data.caption?.trim() || "",
        tag: data.tag.trim(),
      };

      await api.post("/links", linkData);
      toast.success("Link added successfully!", { duration: 3000 });
      reset();
      navigate("/");
    } catch (error) {
      console.error("Error adding link:", error);
      const errorMessage =
        error.response?.data?.message ||
        "Failed to add link. Please try again.";
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleTagSelect = (tag) => {
    setValue("tag", tag);
  };

  return (
    <motion.div
      className="min-h-screen pt-20 px-4 sm:px-6 lg:px-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <motion.div
          className="text-center mb-8"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Instagram className="w-16 h-16 text-netflix-red mx-auto mb-4" />
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            Add Instagram Link
          </h1>
          <p className="text-netflix-lightGray">
            Save your favorite Instagram posts and reels to your personal
            collection
          </p>
        </motion.div>

        {/* Form */}
        <motion.div
          className="bg-netflix-gray rounded-lg p-6 md:p-8 shadow-2xl"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* URL Input */}
            <div>
              <label className="block text-sm font-medium text-netflix-lightGray mb-2">
                <LinkIcon className="w-4 h-4 inline mr-2" />
                Instagram URL *
              </label>
              <input
                type="url"
                {...register("url", {
                  required: "Instagram URL is required",
                  validate: validateInstagramUrl,
                })}
                className="netflix-input w-full"
                placeholder="https://www.instagram.com/p/..."
              />
              {errors.url && (
                <p className="mt-2 text-sm text-red-400">
                  {errors.url.message}
                </p>
              )}
            </div>

            {/* Caption Input */}
            <div>
              <label className="block text-sm font-medium text-netflix-lightGray mb-2">
                <MessageCircle className="w-4 h-4 inline mr-2" />
                Caption (Optional)
              </label>
              <textarea
                {...register("caption")}
                className="netflix-input w-full h-24 resize-none"
                placeholder="Add a personal note about this post..."
              />
            </div>

            {/* Tag Selection */}
            <div>
              <label className="block text-sm font-medium text-netflix-lightGray mb-2">
                <Tag className="w-4 h-4 inline mr-2" />
                Category/Tag *
              </label>

              <input
                type="text"
                {...register("tag", {
                  required: "Please select or enter a tag",
                })}
                className="netflix-input w-full mb-4"
                placeholder="Enter custom tag or select from below..."
              />

              {/* Merged Tags */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {tags.map((tag) => (
                  <motion.button
                    key={tag}
                    type="button"
                    onClick={() => handleTagSelect(tag)}
                    className={`px-3 py-2 text-sm rounded-md transition-all duration-200 ${
                      watchedTag === tag
                        ? "bg-netflix-red text-white scale-105"
                        : "bg-netflix-black text-netflix-lightGray hover:bg-netflix-red hover:text-white"
                    }`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {tag}
                  </motion.button>
                ))}
              </div>

              {errors.tag && (
                <p className="mt-2 text-sm text-red-400">
                  {errors.tag.message}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <motion.button
              type="submit"
              disabled={isSubmitting}
              className="netflix-button w-full disabled:opacity-50 disabled:cursor-not-allowed"
              whileHover={{ scale: isSubmitting ? 1 : 1.02 }}
              whileTap={{ scale: isSubmitting ? 1 : 0.98 }}
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center">
                  <motion.div
                    className="w-5 h-5 border-2 border-white border-t-transparent rounded-full mr-2"
                    animate={{ rotate: 360 }}
                    transition={{
                      duration: 1,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                  />
                  Adding Link...
                </span>
              ) : (
                "Add to Collection"
              )}
            </motion.button>
          </form>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default AddLink;
