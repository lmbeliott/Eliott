import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// Publié sous https://lmbeliott.github.io/Eliott/cordee/ (VITE_BASE=/Eliott/cordee/).
export default defineConfig({
  plugins: [react(), tailwindcss()],
  base: process.env.VITE_BASE ?? '/',
  worker: { format: 'es' },
  build: { target: 'es2022', chunkSizeWarningLimit: 900 },
})
