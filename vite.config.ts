import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'
import { postCssPxToRem } from 'postcss-pxtorem'

const pathResolve = (dir: string): any => {
  return resolve(__dirname, '.', dir)
}

const alias: Record<string, string> = {
  '@': pathResolve("src")
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias,
    extensions:['.js', '.ts', '.jsx', '.d.ts', 'json']
  },
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@import '@/theme.scss';`
      },
    }
  },
  server:{
    host:true
  }
})
