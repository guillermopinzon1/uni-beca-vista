import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 3000,
    // Para HTTPS local, genera certificados con mkcert y descomenta:
    // https: {
    //   key: path.resolve(__dirname, './certs/localhost-key.pem'),
    //   cert: path.resolve(__dirname, './certs/localhost.pem'),
    // },
    // Sin proxy - se usa directamente el backend
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
  },
}));
