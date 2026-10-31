import db from "../config/database.js";

const publicFields = `
  id,
  name,
  email,
  created_at
`;

export const getAllUsers = async () => {
  return db
    .prepare(
      `SELECT ${publicFields}
       FROM users
       ORDER BY id DESC`
    )
    .all();
};

export const getUserById = async (id) => {
  return (
    db
      .prepare(
        `SELECT ${publicFields}
         FROM users
         WHERE id = ?`
      )
      .get(Number(id)) || null
  );
};

export const getUserForLogin = async (email) => {
  return (
    db
      .prepare(
        `SELECT *
         FROM users
         WHERE email = ?`
      )
      .get(email) || null
  );
};

export const createUser = async ({
  name,
  email,
  passwordHash,
}) => {
  const result = db
    .prepare(
      `INSERT INTO users
       (name, email, password_hash, role)
       VALUES (?, ?, ?, 'manager')`
    )
    .run(name, email, passwordHash);

  return getUserById(result.lastInsertRowid);
};