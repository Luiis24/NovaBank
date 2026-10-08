import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { federation } from '@module-federation/vite'
export default defineConfig({
  plugins: [react(), federation({
    name: 'host',
    remotes: {
      credit: { type: 'module', name: 'credit', entry: '/remotes/credit/remoteEntry.js' },
      insurance: { type: 'module', name: 'insurance', entry: '/remotes/insurance/remoteEntry.js' },
    },
    dts: false, shared: { react: { singleton: true }, 'react-dom': { singleton: true } },
  })],
  build: { target: 'esnext' },
})
