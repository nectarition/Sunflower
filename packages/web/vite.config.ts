import fs from 'fs'
import react from '@vitejs/plugin-react-swc'
import { defineConfig, type UserConfig } from 'vite'

// https://vitejs.dev/config/
export default ({ mode }: { mode: string }): UserConfig => {
  return defineConfig({
    plugins: [react()],
    server: {
      proxy: {
        '/api': {
          target: 'http://localhost:8788',
          changeOrigin: true
        }
      },
      ...mode !== 'production' && ({
        https: {
          key: fs.readFileSync('../../certs/localhost-key.pem'),
          cert: fs.readFileSync('../../certs/localhost.pem')
        }
      })
    }
  })
}
