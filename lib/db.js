/**
 * Shared database layer.
 * Uses @libsql/client which works with both:
 *   - Local SQLite files (development)
 *   - Turso remote databases (production on Vercel)
 *
 * Configuration via environment variables:
 *   TURSO_DATABASE_URL  - "file:./server/database/patient-app.db" (local) or "libsql://your-db.turso.io" (production)
 *   TURSO_AUTH_TOKEN    - Required only for remote Turso databases
 */
import { createClient } from "@libsql/client";

let _client = null;

export function getDb() {
  if (!_client) {
    _client = createClient({
      url: process.env.TURSO_DATABASE_URL || "file:./server/database/patient-app.db",
      authToken: process.env.TURSO_AUTH_TOKEN || undefined,
    });
  }
  return _client;
}

/**
 * Initialize database tables (runs CREATE TABLE IF NOT EXISTS).
 * Safe to call multiple times.
 */
export async function initDb() {
  const db = getDb();

  await db.execute(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      password TEXT NOT NULL,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    )
  `);

  await db.execute(`
    CREATE TABLE IF NOT EXISTS patients (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      first_name TEXT NOT NULL,
      last_name TEXT NOT NULL,
      dni TEXT NOT NULL,
      birth_date TEXT NOT NULL,
      gender TEXT NOT NULL,
      phone TEXT DEFAULT '',
      email TEXT DEFAULT '',
      address TEXT DEFAULT '',
      insurance_number TEXT DEFAULT '',
      blood_type TEXT DEFAULT '',
      allergies TEXT DEFAULT '',
      diagnosis TEXT DEFAULT '',
      treatment TEXT DEFAULT '',
      notes TEXT DEFAULT '',
      status TEXT NOT NULL DEFAULT 'active' CHECK(status IN ('active', 'inactive')),
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      updated_at TEXT NOT NULL DEFAULT (datetime('now')),
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    )
  `);

  await db.execute(
    `CREATE INDEX IF NOT EXISTS idx_patients_user_id ON patients(user_id)`
  );
  await db.execute(
    `CREATE INDEX IF NOT EXISTS idx_patients_status ON patients(status)`
  );
}

/**
 * Converts a DB row (snake_case) to a frontend-friendly object (camelCase).
 */
export function patientToClient(row) {
  if (!row) return null;
  return {
    id: row.id,
    userId: row.user_id,
    firstName: row.first_name,
    lastName: row.last_name,
    dni: row.dni,
    birthDate: row.birth_date,
    gender: row.gender,
    phone: row.phone,
    email: row.email,
    address: row.address,
    insuranceNumber: row.insurance_number,
    bloodType: row.blood_type,
    allergies: row.allergies,
    diagnosis: row.diagnosis,
    treatment: row.treatment,
    notes: row.notes,
    status: row.status,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}
