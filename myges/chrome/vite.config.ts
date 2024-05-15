import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import tsConfigPaths from "vite-tsconfig-paths";
import crx from "vite-plugin-crx-mv3";
// https://vitejs.dev/config/

export default defineConfig(({ mode }) => {
  return {
    plugins: [
      tsConfigPaths(),
      react(),
      crx({ manifest: "./src/manifest.json" }),
    ],
    build: {
      emptyOutDir: mode == "production",
    },
  };
});
