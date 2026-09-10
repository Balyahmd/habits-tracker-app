import react, { reactCompilerPreset } from '@vitejs/plugin-react'
import babel from '@rolldown/plugin-babel'
import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    babel({ presets: [reactCompilerPreset()] }),
    tailwindcss()
  ],

 server: {
    // Tanpa ini dev server cuma mendengarkan localhost di dalam container,
    // jadi tidak bisa dibuka dari browser di komputer sendiri
    host: true,
    port: 5173,
    watch: {
      // Sebagian sistem berkas tidak mengabarkan perubahan ke container,
      // jadi Vite diminta memeriksa berkas secara berkala
      usePolling: true
    }
  }
})
