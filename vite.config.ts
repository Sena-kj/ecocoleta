import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { viteSingleFile } from 'vite-plugin-singlefile'
import path from 'node:path'

export default defineConfig({
  // Path relativo para os assets do build funcionarem aberto via file://
  base: './',
  // Inlineia JS + CSS num único index.html. Necessário para abrir o build
  // direto do disco (file://): scripts type=module são bloqueados por CORS
  // (origin null) quando carregados de arquivo; inline elimina o fetch.
  plugins: [react(), viteSingleFile({ removeViteModuleLoader: true })],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 5173,
    open: true,
  },
})
