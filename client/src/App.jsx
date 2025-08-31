import React from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import Header from "./components/Header";
import Home from "./pages/Home";
import AddLink from "./pages/AddLink";
import SavedLinks from "./pages/SavedLinks";

function PrivateRoute({ children }) {
  const { user } = useAuth();
  const location = useLocation();

  if (!user) {
    return (
      <Navigate
        to="/"
        replace
        state={{ fromProtected: true, attemptedPath: location.pathname }}
      />
    );
  }

  return children;
}

function App() {
  return (
    <AuthProvider>
      <div className="min-h-screen bg-netflix-black text-white">
        <Header />
        <AnimatePresence mode="wait">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route
              path="/add"
              element={
                <PrivateRoute>
                  <AddLink />
                </PrivateRoute>
              }
            />
            <Route
              path="/saved"
              element={
                <PrivateRoute>
                  <SavedLinks />
                </PrivateRoute>
              }
            />
          </Routes>
        </AnimatePresence>
      </div>
    </AuthProvider>
  );
}

export default App;
