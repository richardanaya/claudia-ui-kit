import { fileURLToPath, URL } from "node:url";
import { defineConfig } from "vite";

export default defineConfig({
  build: {
    lib: {
      entry: fileURLToPath(new URL("./src/cdn.ts", import.meta.url)),
      formats: ["es"],
      fileName: "claudia-ui",
    },
    outDir: "dist/cdn",
    emptyOutDir: true,
    sourcemap: true,
    cssCodeSplit: false,
    rollupOptions: {
      output: {
        inlineDynamicImports: true,
        assetFileNames(info) {
          if (info.names?.some(name => name.endsWith(".css")) || info.name?.endsWith(".css")) {
            return "claudia-ui.css";
          }
          return "assets/[name]-[hash][extname]";
        },
      },
    },
  },
});
