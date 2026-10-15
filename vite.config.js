import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";

// Mounts the Express API (api/index.js) inside the Vite dev server,
// so `npm run dev` serves frontend and /api/* from the same origin.
function apiDevServer() {
  return {
    name: "patient-app-api",
    apply: "serve",
    async configureServer(server) {
      const env = loadEnv(server.config.mode, process.cwd(), "");
      for (const [key, value] of Object.entries(env)) {
        if (process.env[key] === undefined) process.env[key] = value;
      }
      if (!process.env.TURSO_DATABASE_URL) {
        process.env.TURSO_DATABASE_URL = `file:${path.resolve("server/database/patient-app.db")}`;
      }
      const { default: app } = await import("./api/index.js");
      server.middlewares.use((req, res, next) => {
        if (req.url?.startsWith("/api")) return app(req, res, next);
        next();
      });
    },
  };
}

export default defineConfig({
  plugins: [react(), tailwindcss(), apiDevServer()],
});
