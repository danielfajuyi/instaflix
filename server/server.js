import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import mongoose from "mongoose";

// Import routes
import linkRoutes from "./src/routes/links.js";
import authRoutes from "./src/routes/auth.js";
import passport from "./src/config/passport.js";
import { errorHandler } from "./src/middleware/errorHandler.js";

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((error) => console.error("MongoDB connection error:", error));

// Security middleware
app.use(
  helmet({
    crossOriginEmbedderPolicy: false,
    contentSecurityPolicy: false,
  })
);

// Trust Vercel's proxy
app.set("trust proxy", 1); // 1 = trust first proxy

// ✅ CORS configuration (only allow your frontend localhost + vercel)
app.use(
  cors({
    origin: ["http://localhost:5173", "http://localhost:3000", "https://instaflix.vercel.app"],
    credentials: true,
  })
);

// Body parsing middleware
app.use(compression());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Initialize Passport
app.use(passport.initialize());

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
  });
});

// API routes
app.use("/api/auth", authRoutes);
app.use("/api/links", linkRoutes);

// 404 handler
app.use("*", (req, res) => {
  res.status(404).json({
    success: false,
    message: "API endpoint not found",
  });
});

// Global error handler
app.use(errorHandler);

// ---- FIXED PART ----
// Run app.listen() only in development, skip on Vercel
if (process.env.NODE_ENV !== "production") {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Environment: ${process.env.NODE_ENV}`);
  });
}

// Export app for Vercel
export default app;
