import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Instagram,
  Plus,
  BookmarkCheck,
  Menu,
  X,
  User,
  LogOut,
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import AuthModal from "./AuthModal";
import { toast } from "react-hot-toast";

const Header = () => {
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const { user, signOut } = useAuth();

  const navItems = [
    { path: "/", label: "Home", icon: Instagram },
    { path: "/add", label: "Add Link", icon: Plus },
    { path: "/saved", label: "Saved", icon: BookmarkCheck },
  ];

  const handleSignOut = async () => {
    try {
      await signOut();
      toast.success("Signed out successfully");
      setShowUserMenu(false);
    } catch (error) {
      toast.error("Failed to sign out");
    }
  };
  return (
    <>
      <motion.header
        className="fixed top-0 left-0 right-0 z-50 bg-netflix-black bg-opacity-90 backdrop-blur-sm border-b border-netflix-gray"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2">
              <Instagram className="w-8 h-8 text-netflix-red" />
              <span className="text-2xl font-bold text-white">Instaflix</span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <nav className="flex items-center space-x-8">
                {navItems.map(({ path, label, icon: Icon }) => (
                  <Link
                    key={path}
                    to={path}
                    className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                      location.pathname === path
                        ? "text-netflix-red bg-netflix-gray"
                        : "text-netflix-lightGray hover:text-white hover:bg-netflix-gray"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{label}</span>
                  </Link>
                ))}
              </nav>

              {/* User Menu */}
              {user ? (
                <div className="relative">
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium text-netflix-lightGray hover:text-white hover:bg-netflix-gray"
                  >
                    <User className="w-4 h-4" />
                    <span>
                      {user.user_metadata?.name ||
                        user.email?.split("@")[0] ||
                        "User"}
                    </span>
                  </button>

                  {showUserMenu && (
                    <motion.div
                      className="absolute right-0 mt-2 w-48 bg-netflix-gray rounded-md shadow-lg border border-gray-600"
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                    >
                      <div className="py-1">
                        <div className="px-4 py-2 text-sm text-netflix-lightGray border-b border-gray-600">
                          {user.user_metadata?.name && (
                            <div className="font-medium">
                              {user.user_metadata.name}
                            </div>
                          )}
                          <div
                            className={
                              user.user_metadata?.name ? "text-xs" : ""
                            }
                          >
                            {user.email}
                          </div>
                        </div>
                        <button
                          onClick={handleSignOut}
                          className="flex items-center space-x-2 w-full px-3 py-2 text-sm text-netflix-lightGray hover:text-white hover:bg-netflix-black"
                        >
                          <LogOut className="w-3 h-3" />
                          <span>Sign Out</span>
                        </button>
                      </div>
                    </motion.div>
                  )}
                </div>
              ) : (
                <button
                  onClick={() => setShowAuthModal(true)}
                  className="netflix-button"
                >
                  Sign In
                </button>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 rounded-md text-netflix-lightGray hover:text-white hover:bg-netflix-gray"
            >
              {isMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <motion.nav
              className="md:hidden py-4 border-t border-netflix-gray"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              {navItems.map(({ path, label, icon: Icon }) => (
                <Link
                  key={path}
                  to={path}
                  onClick={() => setIsMenuOpen(false)}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-md text-base font-medium transition-colors duration-200 ${
                    location.pathname === path
                      ? "text-netflix-red bg-netflix-gray"
                      : "text-netflix-lightGray hover:text-white hover:bg-netflix-gray"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{label}</span>
                </Link>
              ))}

              {/* Mobile Auth */}
              <div className="border-t border-netflix-gray mt-4 pt-4">
                {user ? (
                  <div className="px-4">
                    <div className="text-netflix-lightGray text-sm mb-2">
                      {user.user_metadata?.name && (
                        <div className="font-medium">
                          {user.user_metadata.name}
                        </div>
                      )}
                      <div
                        className={user.user_metadata?.name ? "text-xs" : ""}
                      >
                        {user.email}
                      </div>
                    </div>
                    <button
                      onClick={handleSignOut}
                      className="flex items-center space-x-2 text-netflix-lightGray hover:text-white"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                ) : (
                  <div className="px-4">
                    <button
                      onClick={() => {
                        setShowAuthModal(true);
                        setIsMenuOpen(false);
                      }}
                      className="netflix-button w-full"
                    >
                      Sign In
                    </button>
                  </div>
                )}
              </div>
            </motion.nav>
          )}
        </div>
      </motion.header>

      {/* Auth Modal */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
      />
    </>
  );
};

export default Header;
