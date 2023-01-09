import { resolve } from "path";
import { defineConfig } from "vite";

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, "index.html"),
        e01: resolve(__dirname, "pages/e01/index.html"),
      },
    },
  },
});
