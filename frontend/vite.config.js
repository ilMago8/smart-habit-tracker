import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    host: true, // Espone su tutte le interfacce di rete
    open: true  // Apre automaticamente il browser
  },
  build: {
    outDir: 'dist',
    sourcemap: false, // Disabilita sourcemaps per produzione
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom']
        }
      }
    }
  },
  optimizeDeps: {
    include: ['react', 'react-dom']
  }
})
