import pool from "../config/mysql.js";

export const ensureDatabaseColumns = async (table, definitions) => {
  if (!/^[a-z_]+$/.test(table)) {
    throw new Error("Invalid table name for schema migration.");
  }

  const [columns] = await pool.execute(
    `SELECT COLUMN_NAME
     FROM INFORMATION_SCHEMA.COLUMNS
     WHERE TABLE_SCHEMA = DATABASE()
       AND TABLE_NAME = ?`,
    [table]
  );
  const existingColumns = new Set(
    columns.map((column) => column.COLUMN_NAME)
  );

  for (const [column, definition] of Object.entries(definitions)) {
    if (!/^[a-z_]+$/.test(column)) {
      throw new Error("Invalid column name for schema migration.");
    }

    if (!existingColumns.has(column)) {
      await pool.query(
        `ALTER TABLE \`${table}\` ADD COLUMN \`${column}\` ${definition}`
      );
    }
  }
};
