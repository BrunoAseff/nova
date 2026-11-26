/// <reference types="vitest/config" />
import { createReadStream, existsSync, statSync } from "node:fs";
import { extname, join, normalize, resolve } from "node:path";
import babel from "@rolldown/plugin-babel";
import tailwindcss from "@tailwindcss/vite";
import react, { reactCompilerPreset } from "@vitejs/plugin-react";
import { defineConfig, type Plugin } from "vite";

const MEDIA_DIR = resolve(import.meta.dirname, "media");
const MEDIA_TYPES: Record<string, string> = {
  ".webp": "image/webp",
  ".avif": "image/avif",
  ".jpg": "image/jpeg",
  ".png": "image/png",
  ".mp3": "audio/mpeg",
  ".m4a": "audio/mp4",
  ".ogg": "audio/ogg",
  ".opus": "audio/ogg",
  ".wav": "audio/wav",
};

/**
 * Em dev, serve a pasta local `media/` em `/media`, como se fosse o bucket R2.
 * Em produção, `VITE_ASSETS_URL` aponta para o domínio do bucket.
 */
function localMedia(): Plugin {
  return {
    name: "nova:local-media",
    apply: "serve",
    configureServer(server) {
      server.middlewares.use("/media", (req, res, next) => {
        const path = normalize(join(MEDIA_DIR, decodeURIComponent(req.url?.split("?")[0] ?? "")));
        if (!path.startsWith(MEDIA_DIR) || !existsSync(path) || !statSync(path).isFile()) {
          return next();
        }
        res.setHeader("Content-Type", MEDIA_TYPES[extname(path)] ?? "application/octet-stream");
        createReadStream(path).pipe(res);
      });
    },
  };
}

export default defineConfig({
  plugins: [react(), babel({ presets: [reactCompilerPreset()] }), tailwindcss(), localMedia()],
  resolve: {
    alias: { "@": resolve(import.meta.dirname, "src") },
  },
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./src/test-setup.ts"],
  },
});
