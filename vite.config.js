import { copyFile, mkdir } from 'node:fs/promises'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const githubPagesBase = '/hlimebakery/'
const staticRoutes = [
  'menu',
  'celebration',
  'about',
  'contact',
  'cart',
  'ko',
  'ko/menu',
  'ko/celebration',
  'ko/about',
  'ko/contact',
  'ko/cart',
]

function githubPagesSpaFallback() {
  return {
    name: 'github-pages-spa-fallback',
    apply: 'build',
    async closeBundle() {
      await copyFile('dist/index.html', 'dist/404.html')
      await Promise.all(staticRoutes.map(async (route) => {
        const routeDirectory = `dist/${route}`
        await mkdir(routeDirectory, { recursive: true })
        await copyFile('dist/index.html', `${routeDirectory}/index.html`)
      }))
    },
  }
}

export default defineConfig(({ mode }) => ({
  plugins: [react(), githubPagesSpaFallback()],
  base: mode === 'development' ? '/' : githubPagesBase,
}))
