import bcrypt from "bcryptjs";
import { env } from "../config/env.js";
import pool from "../config/mysql.js";

const password = process.env.ADMIN_PASSWORD;
if (!password || password.length < 8) {
  throw new Error("Set ADMIN_PASSWORD to at least 8 characters in .env before seeding the admin user.");
}

const name = process.env.ADMIN_NAME || "مديرة ANBIRA";
const email = (process.env.ADMIN_EMAIL || "admin@anbira.local").trim().toLowerCase();
const [existing] = await pool.execute("SELECT id FROM users WHERE email = ?", [email]);

if (existing.length) {
  console.log(`Admin user already exists: ${email}`);
} else {
  await pool.execute(
    "INSERT INTO users (name, email, password_hash, role) VALUES (?, ?, ?, 'admin')",
    [name, email, await bcrypt.hash(password, 12)],
  );
  console.log(`Admin user created: ${email}`);
}

await pool.end();
