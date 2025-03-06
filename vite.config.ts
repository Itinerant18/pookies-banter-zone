
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    mode === 'development' &&
    componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
    // Add dedicated resolution for date-fns to prevent conflicts
    dedupe: ['date-fns', 'date-fns-tz']
  },
  // Ensure optimization properly bundles date-fns
  optimizeDeps: {
    include: ['date-fns'],
    force: true
  }
}));
