import { defineConfig } from 'vite'

export default defineConfig({
  root: '.', // looks for index.html in project root
  publicDir: 'public', // where static assets go
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    emptyOutDir: true
  }
})