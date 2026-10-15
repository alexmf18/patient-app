/**
 * Database seed script.
 * Works with both local SQLite and remote Turso.
 *
 * Local:  node server/database/seed.js
 * Remote: TURSO_DATABASE_URL=libsql://... TURSO_AUTH_TOKEN=... node server/database/seed.js
 */
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import path from "path";
import bcrypt from "bcryptjs";
import { v4 as uuidv4 } from "uuid";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, "..", "..", ".env") });

// Default to local SQLite file
if (!process.env.TURSO_DATABASE_URL) {
  process.env.TURSO_DATABASE_URL = `file:${path.resolve(__dirname, "patient-app.db")}`;
}

const { getDb, initDb } = await import("../../lib/db.js");

async function seed() {
  console.log(`📂 Database: ${process.env.TURSO_DATABASE_URL}`);

  // Initialize tables
  await initDb();
  console.log("✓ Tables created/verified.");

  const db = getDb();

  // Check if data already exists
  const existing = await db.execute("SELECT COUNT(*) as count FROM users");
  if (existing.rows[0].count > 0) {
    console.log("⚠ Database already has data. Skipping seed.");
    const patients = await db.execute("SELECT COUNT(*) as count FROM patients");
    console.log(`  Users: ${existing.rows[0].count}`);
    console.log(`  Patients: ${patients.rows[0].count}`);
    process.exit(0);
  }

  console.log("🌱 Seeding database...");

  // Create demo user
  const userId = uuidv4();
  const hashedPassword = bcrypt.hashSync("password123", 10);
  const now = new Date().toISOString();

  await db.execute({
    sql: "INSERT INTO users (id, name, email, password, created_at) VALUES (?, ?, ?, ?, ?)",
    args: [userId, "Dr. Demo García", "demo@hospital.com", hashedPassword, now],
  });

  console.log("✓ Demo user created: demo@hospital.com / password123");

  // Seed patients
  const patients = [
    {
      firstName: "María", lastName: "García López", dni: "12345678A",
      birthDate: "1985-03-15", gender: "Femenino", phone: "+34 612 345 678",
      email: "maria.garcia@email.com", address: "Calle Mayor 12, 3ºA, Madrid",
      insuranceNumber: "SS-2851-9374-01", bloodType: "A+",
      allergies: "Penicilina, Polen", diagnosis: "Hipertensión arterial leve",
      treatment: "Enalapril 10mg/día. Control mensual de tensión.",
      notes: "Paciente con buena adherencia al tratamiento. Próxima revisión en 3 meses.",
      status: "active", createdAt: "2025-11-10T09:30:00Z", updatedAt: "2026-01-15T11:00:00Z",
    },
    {
      firstName: "Carlos", lastName: "Martínez Ruiz", dni: "87654321B",
      birthDate: "1972-07-22", gender: "Masculino", phone: "+34 698 765 432",
      email: "carlos.martinez@email.com", address: "Av. de la Constitución 45, Sevilla",
      insuranceNumber: "SS-1472-6839-05", bloodType: "O-",
      allergies: "Ninguna conocida", diagnosis: "Diabetes mellitus tipo 2",
      treatment: "Metformina 850mg/12h. Dieta hipoglucémica.",
      notes: "HbA1c último control: 6.8%. Mejoría notable con cambio de hábitos.",
      status: "active", createdAt: "2025-09-05T14:20:00Z", updatedAt: "2026-02-01T10:30:00Z",
    },
    {
      firstName: "Ana", lastName: "Fernández Soto", dni: "11223344C",
      birthDate: "1990-12-01", gender: "Femenino", phone: "+34 655 112 233",
      email: "ana.fernandez@email.com", address: "Plaza del Sol 8, 1ºB, Barcelona",
      insuranceNumber: "SS-3947-2058-12", bloodType: "B+",
      allergies: "Ibuprofeno, Mariscos", diagnosis: "Ansiedad generalizada",
      treatment: "Sertralina 50mg/día. Terapia cognitivo-conductual semanal.",
      notes: "Evolución favorable. Reducir dosis en 2 meses si mantiene mejoría.",
      status: "active", createdAt: "2025-10-20T08:45:00Z", updatedAt: "2026-01-28T16:15:00Z",
    },
    {
      firstName: "Pedro", lastName: "López Navarro", dni: "55667788D",
      birthDate: "1965-05-30", gender: "Masculino", phone: "+34 677 889 900",
      email: "pedro.lopez@email.com", address: "Calle Alcalá 120, Madrid",
      insuranceNumber: "SS-5028-1746-08", bloodType: "AB+",
      allergies: "Sulfamidas", diagnosis: "Artrosis de rodilla bilateral",
      treatment: "Paracetamol 1g/8h según dolor. Fisioterapia 3 veces/semana.",
      notes: "Valorar infiltración si no mejora en 6 semanas. Derivar a traumatología.",
      status: "inactive", createdAt: "2025-06-12T11:00:00Z", updatedAt: "2025-12-20T09:45:00Z",
    },
    {
      firstName: "Lucía", lastName: "Romero Díaz", dni: "99887766E",
      birthDate: "1998-08-14", gender: "Femenino", phone: "+34 622 334 455",
      email: "lucia.romero@email.com", address: "Rúa do Franco 5, Santiago de Compostela",
      insuranceNumber: "SS-7193-4620-03", bloodType: "O+",
      allergies: "Látex", diagnosis: "Asma bronquial intermitente",
      treatment: "Salbutamol inhalado a demanda. Budesonida 200mcg/12h en brotes.",
      notes: "Espirometría pendiente para control. Evitar desencadenantes ambientales.",
      status: "active", createdAt: "2025-12-01T15:30:00Z", updatedAt: "2026-02-05T13:20:00Z",
    },
  ];

  for (const p of patients) {
    await db.execute({
      sql: `INSERT INTO patients (
        id, user_id, first_name, last_name, dni, birth_date, gender,
        phone, email, address, insurance_number, blood_type,
        allergies, diagnosis, treatment, notes, status, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      args: [
        uuidv4(), userId, p.firstName, p.lastName, p.dni, p.birthDate, p.gender,
        p.phone, p.email, p.address, p.insuranceNumber, p.bloodType,
        p.allergies, p.diagnosis, p.treatment, p.notes, p.status,
        p.createdAt, p.updatedAt,
      ],
    });
  }

  console.log(`✓ ${patients.length} patients seeded for demo user.`);
  console.log("\n🎉 Database seeding complete!");
  console.log("   Login with: demo@hospital.com / password123");
}

seed().catch(console.error);
