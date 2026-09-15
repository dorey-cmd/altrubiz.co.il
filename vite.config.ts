import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    // Temporary: allow access via the localtunnel URL used to preview on mobile.
    allowedHosts: ['.loca.lt'],
  },
})
