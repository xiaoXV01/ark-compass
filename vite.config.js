import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import ElementPlus from 'unplugin-element-plus/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'

// https://vite.dev/config/
export default defineConfig({
  base: '/ark/',
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3120',
        changeOrigin: true,
      },
    },
  },
  plugins: [
    vue(),
    ElementPlus({}),
    Components({
      resolvers: [ElementPlusResolver()],
      dts: false,
    }),
  ],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules/vue')) {
            return 'vendor-vue'
          }
          if (id.includes('node_modules/element-plus/dist/locale') || id.includes('node_modules/@element-plus')) {
            return 'vendor-element-locale'
          }
          if (id.includes('node_modules/element-plus')) {
            return 'vendor-element'
          }
          if (id.includes('node_modules/dexie') || id.includes('node_modules/html2canvas')) {
            return 'vendor-misc'
          }
        },
      },
    },
    chunkSizeWarningLimit: 600,
  },
})
