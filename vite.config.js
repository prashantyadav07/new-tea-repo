import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { createHtmlPlugin } from 'vite-plugin-html'
import path from "path"
import { fileURLToPath } from "url"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    createHtmlPlugin({
      inject: {
        tags: [
          {
            injectTo: 'head',
            tag: 'link',
            attrs: {
              rel: 'preload',
              as: 'image',
              type: 'image/webp',
              fetchpriority: 'high',
              href: '/src/assets/brandwo.webp',
            },
          },
        ],
      },
    }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  css: {
    devSourcemap: false,
  },
  build: {
    cssCodeSplit: true,
    cssMinify: true,
    modulePreload: {
      polyfill: false
    },
    target: 'esnext',
    chunkSizeWarningLimit: 500,
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor-react': ['react', 'react-dom', 'react-router-dom'],
          'vendor-animation': ['framer-motion'],
          'vendor-ui': ['lucide-react', 'axios', 'sonner']
        }
      }
    }
  }
})
