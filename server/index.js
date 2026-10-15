/**
 * Local development Express server.
 * Imports the Vercel API app and runs it with app.listen().
 * Uses the same code as production but with a local SQLite file.
 */
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import path from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, "..", ".env") });

// Set local SQLite file if not already set
if (!process.env.TURSO_DATABASE_URL) {
  process.env.TURSO_DATABASE_URL = `file:${path.resolve(__dirname, "database", "patient-app.db")}`;
}

// Import the Vercel API app (reuse all routes)
const { default: app } = await import("../api/index.js");

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`✓ PatientApp server running on http://localhost:${PORT}`);
  console.log(`  Database: ${process.env.TURSO_DATABASE_URL}`);
});
