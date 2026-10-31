import pool from "../config/mysql.js";
import { ensureDatabaseColumns } from "../utils/ensureDatabaseColumns.js";

let schemaReadyPromise;

const ensureTailoringOrderSchema = async () => {
  if (!schemaReadyPromise) {
    schemaReadyPromise = ensureDatabaseColumns("tailoring_orders", {
      national_id: "VARCHAR(30) NULL",
    }).catch((error) => {
      schemaReadyPromise = null;
      throw error;
    });
  }

  await schemaReadyPromise;
};

export const getAllTailoringOrders = async () => {
  await ensureTailoringOrderSchema();

  const [rows] = await pool.query(`
    SELECT *
    FROM tailoring_orders
    ORDER BY id DESC
  `);

  return rows;
};

export const createTailoringOrder = async (data) => {
  await ensureTailoringOrderSchema();

  const [result] = await pool.execute(
    `
    INSERT INTO tailoring_orders (
      full_name,
      phone,
      national_id,
      description,
      design_image,
      quantity,
      size,
      color,
      delivery_method,
      wilaya,
      commune,
      address,
      notes
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `,
    [
      data.fullName.trim(),
      data.phone.trim(),
      data.nationalId.trim(),
      data.description.trim(),
      data.designImage || null,
      Number(data.quantity || 1),
      data.size,
      data.color.trim(),
      data.deliveryMethod,
      data.wilaya || null,
      data.commune || null,
      data.address || null,
      data.notes || null,
    ]
  );

  const [rows] = await pool.execute(
    "SELECT * FROM tailoring_orders WHERE id = ?",
    [result.insertId]
  );

  return rows[0];
};

export const deleteTailoringOrder = async (id) => {
  await ensureTailoringOrderSchema();

  const [result] = await pool.execute(
    "DELETE FROM tailoring_orders WHERE id = ?",
    [Number(id)]
  );

  return result.affectedRows > 0;
};