import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";
export default defineConfig({
  plugins: [tailwindcss()],
  server: {
    port: 5175, // Set the port to match what you're using
    strictPort: true, // Fail if port is already in use
  },
});
