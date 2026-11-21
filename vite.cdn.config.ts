import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath, URL } from "node:url";
import { defineConfig, type Plugin } from "vite";

const version = JSON.parse(readFileSync(new URL("./package.json", import.meta.url), "utf8")).version as string;
const banner = `/*! Claudia UI Kit v${version} · MIT License · (c) 2026 Richard Anaya */`;

function licenseBanner(): Plugin {
  return {
    name: "claudia-license-banner",
    enforce: "post",
    writeBundle(options) {
      const dir = options.dir ?? fileURLToPath(new URL("./dist/cdn", import.meta.url));
      for (const name of ["claudia-ui.js", "claudia-ui.css"]) {
        const file = join(dir, name);
        const text = readFileSync(file, "utf8");
        if (!text.startsWith(`${banner}\n`)) writeFileSync(file, `${banner}\n${text}`);
      }
    },
  };
}

export default defineConfig({
  plugins: [licenseBanner()],
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
        banner,
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
