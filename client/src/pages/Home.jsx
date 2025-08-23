import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Plus, Instagram } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "react-hot-toast";
import NetflixRow from "../components/NetflixRow";
import HeroSlider from "../components/HeroSlider";
import LinkModal from "../components/LinkModal";
import { api } from "../lib/api";
import { useAuth } from "../contexts/AuthContext";

const Home = () => {
  const [groupedLinks, setGroupedLinks] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [latestLinks, setLatestLinks] = useState([]);
  const [selectedLink, setSelectedLink] = useState(null);
  const { user } = useAuth();

  const fetchGroupedLinks = async () => {
    try {
      if (!user) {
        setGroupedLinks({})
        setLatestLinks([])
        setIsLoading(false)
        return
      }

      setIsLoading(true);
      const response = await api.get("/links/grouped");
      setGroupedLinks(response.data);

      // Get latest 5 links for hero slider
      const allLinks = Object.values(response.data).flat();
      const sortedLinks = allLinks.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );
      setLatestLinks(sortedLinks.slice(0, 5));
    } catch (error) {
      console.error("Error fetching grouped links:", error);
      toast.error("Failed to load links");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchGroupedLinks();
  }, [user]);

  const handleDeleteLink = async (linkId) => {
    try {
      await api.delete(`/links/${linkId}`);
      // Refresh the grouped links
      fetchGroupedLinks();
    } catch (error) {
      console.error("Error deleting link:", error);
      throw error;
    }
  };

  const handleUpdateLink = async (linkId, data) => {
    try {
      await api.patch(`/links/${linkId}`, data);
      // Refresh the grouped links
      fetchGroupedLinks();
    } catch (error) {
      console.error("Error updating link:", error);
      throw error;
    }
  };

  const handleLinkClick = (link) => {
    setSelectedLink(link);
  };
  const totalLinks = Object.values(groupedLinks).reduce(
    (sum, links) => sum + links.length,
    0
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <motion.div
          className="flex items-center space-x-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <Instagram className="w-8 h-8 text-netflix-red animate-pulse" />
          <span className="text-xl">Loading your collection...</span>
        </motion.div>
      </div>
    );
  }

  if (totalLinks === 0) {
    return (
      <motion.div
        className="min-h-screen flex items-center justify-center px-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="text-center max-w-md">
          <Instagram className="w-16 h-16 text-netflix-red mx-auto mb-6" />
          <h1 className="text-3xl font-bold mb-4">Your Instagram Collection</h1>
          <p className="text-netflix-lightGray mb-8">
            Start building your personalized Netflix-style collection of
            Instagram posts and reels.
          </p>
          <Link
            to="/add"
            className="netflix-button inline-flex items-center space-x-2"
          >
            <Plus className="w-5 h-5" />
            <span>Add Your First Link</span>
          </Link>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.main
      className="pt-16 pb-8 min-h-screen"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Hero Slider */}
      {latestLinks.length > 0 && (
        <HeroSlider links={latestLinks} onLinkClick={handleLinkClick} />
      )}

      {/* Hero Section */}
      <section className="px-4 sm:px-6 lg:px-8 mb-12 mt-12">
        <motion.div
          className="max-w-3xl"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
        >
          <h2 className="text-2xl md:text-3xl font-bold mb-4">
            Browse by Category
          </h2>
          <div className="flex items-center space-x-3">
            <Link to="/add" className="netflix-button">
              <Plus className="w-4 h-4 mr-2" />
              Add New Link
            </Link>
            <span className="text-netflix-lightGray">
              {totalLinks} {totalLinks === 1 ? "link" : "links"} saved
            </span>
          </div>
        </motion.div>
      </section>

      {/* Netflix Rows */}
      {Object.entries(groupedLinks).map(([tag, links]) => (
        <NetflixRow
          key={tag}
          title={tag}
          links={links}
          onDelete={handleDeleteLink}
          onUpdate={handleUpdateLink}
        />
      ))}

      {/* Link Modal */}
      {selectedLink && (
        <LinkModal
          link={selectedLink}
          onClose={() => setSelectedLink(null)}
          onUpdate={handleUpdateLink}
          onDelete={handleDeleteLink}
        />
      )}
    </motion.main>
  );
};

export default Home;
