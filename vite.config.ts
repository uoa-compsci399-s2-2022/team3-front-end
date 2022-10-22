import {defineConfig} from 'vite'
import vue from '@vitejs/plugin-vue'
import {resolve, dirname} from 'path'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import {ElementPlusResolver} from 'unplugin-vue-components/resolvers'
import vueJsx from '@vitejs/plugin-vue-jsx'
import {fileURLToPath} from 'url'
import VueI18nPlugin from '@intlify/unplugin-vue-i18n/vite'
import {VitePWA} from 'vite-plugin-pwa'

const pathResolve = (dir: string): any => {
    return resolve(__dirname, '.', dir)
}

const alias: Record<string, string> = {
    '@': pathResolve("src")
}

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        vue(),
        VitePWA({
            registerType: 'autoUpdate',
            devOptions: {
                enabled: true
            },
            includeAssets: ['logo.svg', 'pwa-uoa-512.png', 'pwa-uoa-192.png', 'apple-touch-icon.png'],
            workbox: {
                sourcemap: true,
                maximumFileSizeToCacheInBytes: 10000000
            },
            manifest: {
                name: 'MTMS UoA',
                short_name: 'MTMS',
                description: 'Marker & Tutor Management System',
                theme_color: '#222F3D',
                icons: [
                    {
                        src: 'pwa-uoa-512.png',
                        sizes: '512x512',
                        type: 'image/png',
                    },
                    {
                        src: 'pwa-uoa-192.png',
                        sizes: '192x192',
                        type: 'image/png',
                    },
                ]

            }
        }),
        AutoImport({
            resolvers: [ElementPlusResolver()],
        }),
        Components({
            resolvers: [ElementPlusResolver()],
        }),
        vueJsx({
            // options are passed on to @vue/babel-plugin-jsx
        }),
        VueI18nPlugin({
            /* options */
            // locale messages resource pre-compile option
            include: resolve(dirname(fileURLToPath(import.meta.url)), './path/to/src/locales/**'),
        }),
    ],
    resolve: {
        alias,
        extensions: ['.js', '.ts', '.jsx', '.d.ts', 'json']
    },
    css: {
        preprocessorOptions: {
            scss: {
                additionalData: `@import '@/styles/theme.scss';`
            },
        }
    },

    server: {
        host: true,
        proxy: {
            '/api': {
                target: ' http://127.0.0.1:5000',
                changeOrigin: true,
                rewrite: (path) => path.replace(/^\/api/, ""),
            },
        },
    },

})
