import { copyFile } from 'node:fs/promises'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const githubPagesBase = '/hlimebakery/'

function githubPagesSpaFallback() {
  return {
    name: 'github-pages-spa-fallback',
    apply: 'build',
    async closeBundle() {
      await copyFile('dist/index.html', 'dist/404.html')
    },
  }
}

export default defineConfig(({ mode }) => ({
  plugins: [react(), githubPagesSpaFallback()],
  base: mode === 'development' ? '/' : githubPagesBase,
}))
