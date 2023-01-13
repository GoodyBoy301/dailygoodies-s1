import { resolve } from "path";
import { defineConfig } from "vite";

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, "index.html"),
        e01: resolve(__dirname, "pages/e01/index.html"),
        e02: resolve(__dirname, "pages/e02/index.html"),
        e04: resolve(__dirname, "pages/e04/index.html"),
      },
    },
  },
});
