import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // GitHub Pages serve o site em /portifolio_pessoal/
  base: '/portifolio_pessoal/',
  test: {
    environment: 'node',
  },
})
