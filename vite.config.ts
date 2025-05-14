
import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Load env variables for the current mode
  const env = loadEnv(mode, process.cwd(), '');
  
  return {
    server: {
      host: "::",
      port: 8080,
      cors: {
        origin: env.VITE_ALLOWED_REDIRECT_DOMAINS 
          ? env.VITE_ALLOWED_REDIRECT_DOMAINS.split(',')
          : ['http://localhost:3000'],
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
        credentials: true,
      }
    },
    plugins: [
      react(),
      mode === 'development' &&
      componentTagger(),
    ].filter(Boolean),
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
        "@monorepo/utils": path.resolve(__dirname, "./packages/utils/src"),
        "@monorepo/presentation": path.resolve(__dirname, "./packages/presentation/src"),
      },
    },
    // Add build configuration for optimal production build
    build: {
      sourcemap: mode !== 'production',
      rollupOptions: {
        output: {
          manualChunks: {
            vendor: ['react', 'react-dom', 'react-router-dom'],
            ui: [
              '@clerk/clerk-react', 
              '@radix-ui/react-dialog',
              'sonner',
              'lucide-react'
            ],
          }
        }
      }
    },
  };
});
