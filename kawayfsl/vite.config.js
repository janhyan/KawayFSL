import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { mediapipe } from 'vite-plugin-mediapipe';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), mediapipe({
    'holistic.js': [
      'VERSION',
      'POSE_CONNECTIONS',
      'HAND_CONNECTIONS',
      'FACEMESH_TESSELATION',
      'Holistic'
    ]
  })],
  server: {
    port: 3000,
  },
})
