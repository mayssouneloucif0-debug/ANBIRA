import pool from "../config/mysql.js";

const applicationQuery = `
  SELECT job_applications.*, jobs.title AS job_title
  FROM job_applications
  JOIN jobs ON job_applications.job_id = jobs.id`;

let schemaReadyPromise;

const ensureApplicantIdentityColumns = async () => {
  if (!schemaReadyPromise) {
    schemaReadyPromise = (async () => {
      const [columns] = await pool.execute(
        `SELECT COLUMN_NAME, COLUMN_TYPE
         FROM INFORMATION_SCHEMA.COLUMNS
         WHERE TABLE_SCHEMA = DATABASE()
           AND TABLE_NAME = 'job_applications'`
      );
      const existingColumns = new Map(
        columns.map((column) => [column.COLUMN_NAME, column.COLUMN_TYPE])
      );
      const missingColumns = [
        ["first_name", "VARCHAR(100) NULL"],
        ["last_name", "VARCHAR(100) NULL"],
        ["national_id", "VARCHAR(30) NULL"],
        ["cv_file", "VARCHAR(500) NULL"],
      ];

      for (const [column, definition] of missingColumns) {
        if (!existingColumns.has(column)) {
          await pool.query(`ALTER TABLE job_applications ADD COLUMN ${column} ${definition}`);
        }
      }

      const statusType = existingColumns.get("status");
      const currentStatusType = "enum('new','reviewing','accepted','rejected')";

      if (statusType !== currentStatusType) {
        await pool.query(
          "ALTER TABLE job_applications MODIFY COLUMN status ENUM('pending', 'reviewed', 'new', 'reviewing', 'accepted', 'rejected') NOT NULL DEFAULT 'new'"
        );
        await pool.query(
          "UPDATE job_applications SET status = CASE WHEN status = 'pending' THEN 'new' WHEN status = 'reviewed' THEN 'reviewing' ELSE status END"
        );
        await pool.query(
          "ALTER TABLE job_applications MODIFY COLUMN status ENUM('new', 'reviewing', 'accepted', 'rejected') NOT NULL DEFAULT 'new'"
        );
      }
    })().catch((error) => {
      schemaReadyPromise = null;
      throw error;
    });
  }

  await schemaReadyPromise;
};

export const getAllJobApplications = async () => {
  await ensureApplicantIdentityColumns();
  const [rows] = await pool.query(`${applicationQuery} ORDER BY job_applications.created_at DESC`);
  return rows;
};

export const getJobApplicationById = async (id) => {
  await ensureApplicantIdentityColumns();
  const [rows] = await pool.execute(`${applicationQuery} WHERE job_applications.id = ?`, [Number(id)]);
  return rows[0] || null;
};

export const createJobApplication = async (application) => {
  await ensureApplicantIdentityColumns();
  const [result] = await pool.execute(
    `INSERT INTO job_applications
      (job_id, full_name, first_name, last_name, national_id, phone, email, experience, message, cv_file, status)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [application.job_id, application.full_name, application.first_name, application.last_name, application.national_id, application.phone, application.email, application.experience, application.message, application.cv_file, "new"],
  );
  return getJobApplicationById(result.insertId);
};

export const updateJobApplicationStatus = async (id, status) => {
  await pool.execute("UPDATE job_applications SET status = ? WHERE id = ?", [status, Number(id)]);
  return getJobApplicationById(id);
};

export const deleteJobApplication = async (id) => {
  const [result] = await pool.execute("DELETE FROM job_applications WHERE id = ?", [Number(id)]);
  return result.affectedRows > 0;
};
