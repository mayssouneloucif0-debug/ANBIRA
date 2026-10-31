import pool from "../config/mysql.js";

export const getAllJobs = async () => {
  const [rows] = await pool.query("SELECT * FROM jobs ORDER BY created_at DESC");
  return rows;
};

export const getJobById = async (id) => {
  const [rows] = await pool.execute("SELECT * FROM jobs WHERE id = ?", [Number(id)]);
  return rows[0] || null;
};

export const createJob = async ({ title, description, requirements, status }) => {
  const [result] = await pool.execute(
    "INSERT INTO jobs (title, description, requirements, status) VALUES (?, ?, ?, ?)",
    [title, description || null, requirements || null, status || "open"],
  );
  return getJobById(result.insertId);
};

export const updateJob = async (id, { title, description, requirements, status }) => {
  await pool.execute(
    "UPDATE jobs SET title = ?, description = ?, requirements = ?, status = ? WHERE id = ?",
    [title, description || null, requirements || null, status, Number(id)],
  );
  return getJobById(id);
};

export const deleteJob = async (id) => {
  const [result] = await pool.execute("DELETE FROM jobs WHERE id = ?", [Number(id)]);
  return result.affectedRows > 0;
};
