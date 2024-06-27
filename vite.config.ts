import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import UnoCSS from 'unocss/vite'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { NaiveUiResolver } from 'unplugin-vue-components/resolvers'

// https://vitejs.dev/config/
export default defineConfig((({ mode }) => {
  const env = loadEnv(mode, process.cwd());

  return {
    base: env.VITE_PUBLIC_PATH,
    plugins: [
      vue(),
      UnoCSS(),
      AutoImport({
        dts: 'src/types/auto-import.d.ts',
        imports: [
          'vue',
          'vue-router',
          'pinia',
          { 'naive-ui': ['useDialog', 'useMessage', 'useNotification', 'useLoadingBar'] },
        ],
        resolvers: [],
        eslintrc: {
          enabled: true,
          filepath: './.eslintrc-auto-import.json',
          globalsPropValue: true,
        },
      }),
      Components({
        dts: 'src/types/components.d.ts',
        resolvers: [NaiveUiResolver()],
      }),
    ],
    resolve: {
      alias: {
        '@': '/src'
      }
    },
    server: {
      hmr: true
    }
  };
}))
