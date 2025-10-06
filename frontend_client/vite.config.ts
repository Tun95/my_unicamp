import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  base: "/",
  css: {
    preprocessorOptions: {
      scss: {
        api: "modern-compiler",
      },
    },
  },
  plugins: [react()],
  build: {
    outDir: "dist",
    assetsDir: "assets",
    rollupOptions: {
      output: {
        format: "es",
        entryFileNames: "assets/[name]-[hash].js",
        chunkFileNames: "assets/[name]-[hash].js",
        assetFileNames: "assets/[name]-[hash].[ext]",
        manualChunks: {
          vendor: ["react", "react-dom"],
        },
      },
    },
  },
  define: {
    global: {},
  },
  server: {
    port: 3000,
    open: true,
  },
  optimizeDeps: {
    include: ["tslib"],
    esbuildOptions: {
      target: "esnext",
    },
  },
  resolve: {
    alias: {
      tslib: "tslib/tslib.es6.js",
    },
  },
});
