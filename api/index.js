/**
 * Vercel Serverless API — single Express app handling all /api/* routes.
 * Uses @libsql/client for both local SQLite and remote Turso.
 */
import express from "express";
import cors from "cors";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";
import { getDb, initDb, patientToClient } from "../lib/db.js";

const app = express();

const JWT_SECRET = process.env.JWT_SECRET || "dev-secret-change-in-production";
const BCRYPT_SALT_ROUNDS = 10;

// Middleware
app.use(cors());
app.use(express.json());

// Ensure tables exist on cold start
let dbInitialized = false;
app.use(async (_req, _res, next) => {
  if (!dbInitialized) {
    await initDb();
    dbInitialized = true;
  }
  next();
});

// ─── Auth middleware ──────────────────────────────────────────

function authenticate(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Acceso no autorizado." });
  }
  try {
    const token = authHeader.split(" ")[1];
    const payload = jwt.verify(token, JWT_SECRET);
    req.userId = payload.userId;
    next();
  } catch {
    return res.status(401).json({ error: "Token inválido o expirado." });
  }
}

// ─── Auth routes ─────────────────────────────────────────────

app.post("/api/auth/register", async (req, res) => {
  try {
    const db = getDb();
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: "Nombre, correo y contraseña son obligatorios." });
    }
    if (password.length < 6) {
      return res.status(400).json({ error: "La contraseña debe tener al menos 6 caracteres." });
    }

    const existing = await db.execute({ sql: "SELECT id FROM users WHERE email = ?", args: [email] });
    if (existing.rows.length > 0) {
      return res.status(409).json({ error: "Este correo electrónico ya está registrado." });
    }

    const id = uuidv4();
    const hashedPassword = bcrypt.hashSync(password, BCRYPT_SALT_ROUNDS);
    const createdAt = new Date().toISOString();

    await db.execute({
      sql: "INSERT INTO users (id, name, email, password, created_at) VALUES (?, ?, ?, ?, ?)",
      args: [id, name, email, hashedPassword, createdAt],
    });

    const token = jwt.sign({ userId: id }, JWT_SECRET, { expiresIn: "7d" });
    res.status(201).json({ token, user: { id, name, email, createdAt } });
  } catch (err) {
    console.error("Register error:", err);
    res.status(500).json({ error: "Error interno del servidor." });
  }
});

app.post("/api/auth/login", async (req, res) => {
  try {
    const db = getDb();
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Correo y contraseña son obligatorios." });
    }

    const result = await db.execute({ sql: "SELECT * FROM users WHERE email = ?", args: [email] });
    const user = result.rows[0];
    if (!user) {
      return res.status(401).json({ error: "Correo o contraseña incorrectos." });
    }

    const validPassword = bcrypt.compareSync(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ error: "Correo o contraseña incorrectos." });
    }

    const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: "7d" });
    res.json({
      token,
      user: { id: user.id, name: user.name, email: user.email, createdAt: user.created_at },
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ error: "Error interno del servidor." });
  }
});

app.get("/api/auth/me", authenticate, async (req, res) => {
  try {
    const db = getDb();
    const result = await db.execute({
      sql: "SELECT id, name, email, created_at FROM users WHERE id = ?",
      args: [req.userId],
    });
    const user = result.rows[0];
    if (!user) {
      return res.status(404).json({ error: "Usuario no encontrado." });
    }
    res.json({
      user: { id: user.id, name: user.name, email: user.email, createdAt: user.created_at },
    });
  } catch (err) {
    console.error("Me error:", err);
    res.status(500).json({ error: "Error interno del servidor." });
  }
});

// ─── Patient routes (all require auth) ───────────────────────

app.get("/api/patients/stats", authenticate, async (req, res) => {
  try {
    const db = getDb();
    const result = await db.execute({
      sql: `SELECT
        COUNT(*) as total,
        SUM(CASE WHEN status = 'active' THEN 1 ELSE 0 END) as active,
        SUM(CASE WHEN status = 'inactive' THEN 1 ELSE 0 END) as inactive
      FROM patients WHERE user_id = ?`,
      args: [req.userId],
    });
    const row = result.rows[0];
    res.json({ total: row.total || 0, active: row.active || 0, inactive: row.inactive || 0 });
  } catch (err) {
    console.error("Stats error:", err);
    res.status(500).json({ error: "Error interno del servidor." });
  }
});

app.get("/api/patients", authenticate, async (req, res) => {
  try {
    const db = getDb();
    const result = await db.execute({
      sql: "SELECT * FROM patients WHERE user_id = ? ORDER BY updated_at DESC",
      args: [req.userId],
    });
    res.json({ patients: result.rows.map(patientToClient) });
  } catch (err) {
    console.error("List patients error:", err);
    res.status(500).json({ error: "Error interno del servidor." });
  }
});

app.get("/api/patients/:id", authenticate, async (req, res) => {
  try {
    const db = getDb();
    const result = await db.execute({
      sql: "SELECT * FROM patients WHERE id = ? AND user_id = ?",
      args: [req.params.id, req.userId],
    });
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Paciente no encontrado." });
    }
    res.json({ patient: patientToClient(result.rows[0]) });
  } catch (err) {
    console.error("Get patient error:", err);
    res.status(500).json({ error: "Error interno del servidor." });
  }
});

app.post("/api/patients", authenticate, async (req, res) => {
  try {
    const db = getDb();
    const {
      firstName, lastName, dni, birthDate, gender,
      phone, email, address, insuranceNumber, bloodType,
      allergies, diagnosis, treatment, notes, status,
    } = req.body;

    if (!firstName || !lastName || !dni || !birthDate || !gender) {
      return res.status(400).json({
        error: "Nombre, apellidos, DNI, fecha de nacimiento y género son obligatorios.",
      });
    }

    const id = uuidv4();
    const now = new Date().toISOString();

    await db.execute({
      sql: `INSERT INTO patients (
        id, user_id, first_name, last_name, dni, birth_date, gender,
        phone, email, address, insurance_number, blood_type,
        allergies, diagnosis, treatment, notes, status, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      args: [
        id, req.userId, firstName, lastName, dni, birthDate, gender,
        phone || "", email || "", address || "", insuranceNumber || "", bloodType || "",
        allergies || "", diagnosis || "", treatment || "", notes || "",
        status || "active", now, now,
      ],
    });

    const result = await db.execute({ sql: "SELECT * FROM patients WHERE id = ?", args: [id] });
    res.status(201).json({ patient: patientToClient(result.rows[0]) });
  } catch (err) {
    console.error("Create patient error:", err);
    res.status(500).json({ error: "Error interno del servidor." });
  }
});

app.put("/api/patients/:id", authenticate, async (req, res) => {
  try {
    const db = getDb();

    // Verify ownership
    const check = await db.execute({
      sql: "SELECT id FROM patients WHERE id = ? AND user_id = ?",
      args: [req.params.id, req.userId],
    });
    if (check.rows.length === 0) {
      return res.status(404).json({ error: "Paciente no encontrado." });
    }

    const {
      firstName, lastName, dni, birthDate, gender,
      phone, email, address, insuranceNumber, bloodType,
      allergies, diagnosis, treatment, notes, status,
    } = req.body;

    const now = new Date().toISOString();

    await db.execute({
      sql: `UPDATE patients SET
        first_name = COALESCE(?, first_name),
        last_name = COALESCE(?, last_name),
        dni = COALESCE(?, dni),
        birth_date = COALESCE(?, birth_date),
        gender = COALESCE(?, gender),
        phone = COALESCE(?, phone),
        email = COALESCE(?, email),
        address = COALESCE(?, address),
        insurance_number = COALESCE(?, insurance_number),
        blood_type = COALESCE(?, blood_type),
        allergies = COALESCE(?, allergies),
        diagnosis = COALESCE(?, diagnosis),
        treatment = COALESCE(?, treatment),
        notes = COALESCE(?, notes),
        status = COALESCE(?, status),
        updated_at = ?
      WHERE id = ? AND user_id = ?`,
      args: [
        firstName, lastName, dni, birthDate, gender,
        phone, email, address, insuranceNumber, bloodType,
        allergies, diagnosis, treatment, notes, status,
        now, req.params.id, req.userId,
      ],
    });

    const result = await db.execute({
      sql: "SELECT * FROM patients WHERE id = ?",
      args: [req.params.id],
    });
    res.json({ patient: patientToClient(result.rows[0]) });
  } catch (err) {
    console.error("Update patient error:", err);
    res.status(500).json({ error: "Error interno del servidor." });
  }
});

app.delete("/api/patients/:id", authenticate, async (req, res) => {
  try {
    const db = getDb();
    const result = await db.execute({
      sql: "DELETE FROM patients WHERE id = ? AND user_id = ?",
      args: [req.params.id, req.userId],
    });
    if (result.rowsAffected === 0) {
      return res.status(404).json({ error: "Paciente no encontrado." });
    }
    res.json({ message: "Paciente eliminado correctamente." });
  } catch (err) {
    console.error("Delete patient error:", err);
    res.status(500).json({ error: "Error interno del servidor." });
  }
});

// Health check
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

export default app;
