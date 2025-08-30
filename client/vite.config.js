import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      "/api": {
        target: "http://localhost:5000", // backend for dev
        changeOrigin: true,
      },
    },
  },
  build: {
    outDir: "dist", // Vercel will serve this folder
    emptyOutDir: true,
  },
  optimizeDeps: {
    exclude: ["lucide-react"],
  },
});
