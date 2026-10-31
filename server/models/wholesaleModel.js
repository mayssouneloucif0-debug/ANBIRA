import pool from "../config/mysql.js";

const fields = [
  "full_name",
  "phone",
  "national_id",
  "order_type",
  "product_name",
  "description",
  "quantity",
  "size",
  "color",
  "delivery_method",
  "wilaya",
  "commune",
  "address",
  "notes",
  "status",
  "design_image",
  "variants",
];

// ترحيل أعمدة وحالات الطلبات القديمة إلى المخطط الحالي.
let schemaReadyPromise;

const ensureWholesaleOrderSchema = async () => {
  if (!schemaReadyPromise) {
    schemaReadyPromise = (async () => {
      const [columns] = await pool.execute(
        `SELECT COLUMN_NAME, COLUMN_TYPE
         FROM INFORMATION_SCHEMA.COLUMNS
         WHERE TABLE_SCHEMA = DATABASE()
           AND TABLE_NAME = 'wholesale_orders'`
      );
      const existingColumns = new Map(
        columns.map((column) => [column.COLUMN_NAME, column.COLUMN_TYPE])
      );

      const missingColumns = [
        ["order_type", "ENUM('sample', 'wholesale') NOT NULL DEFAULT 'wholesale'"],
        ["product_name", "VARCHAR(255) NULL"],
        ["design_image", "VARCHAR(500) NULL"],
        ["national_id", "VARCHAR(30) NULL"],
        ["variants", "JSON NULL"],
      ];

      for (const [column, definition] of missingColumns) {
        if (!existingColumns.has(column)) {
          await pool.query(`ALTER TABLE wholesale_orders ADD COLUMN ${column} ${definition}`);
        }
      }

      const statusType = existingColumns.get("status");
      const currentStatusType = "enum('new','reviewing','confirmed','preparing','completed','cancelled')";

      if (statusType !== currentStatusType) {
        await pool.query(
          "ALTER TABLE wholesale_orders MODIFY COLUMN status ENUM('pending', 'new', 'reviewed', 'reviewing', 'confirmed', 'preparing', 'in_progress', 'completed', 'cancelled') NOT NULL DEFAULT 'new'"
        );
        await pool.query(
          "UPDATE wholesale_orders SET status = CASE WHEN status = 'pending' THEN 'new' WHEN status = 'reviewed' THEN 'reviewing' WHEN status = 'in_progress' THEN 'preparing' ELSE status END"
        );
        await pool.query(
          "ALTER TABLE wholesale_orders MODIFY COLUMN status ENUM('new', 'reviewing', 'confirmed', 'preparing', 'completed', 'cancelled') NOT NULL DEFAULT 'new'"
        );
      }
    })().catch((error) => {
      schemaReadyPromise = null;
      throw error;
    });
  }

  await schemaReadyPromise;
};

export const getAllWholesaleOrders = async () => {
  await ensureWholesaleOrderSchema();

  const [rows] = await pool.query(
    "SELECT * FROM wholesale_orders ORDER BY id DESC"
  );

  return rows;
};

export const getWholesaleOrderById = async (id) => {
  await ensureWholesaleOrderSchema();

  const [rows] = await pool.execute(
    "SELECT * FROM wholesale_orders WHERE id = ?",
    [Number(id)]
  );

  return rows[0] || null;
};

export const createWholesaleOrder = async (order) => {
  await ensureWholesaleOrderSchema();

  const [result] = await pool.execute(
    `INSERT INTO wholesale_orders
    (${fields.join(", ")})
    VALUES (${fields.map(() => "?").join(", ")})`,
    fields.map((field) => order[field] ?? null)
  );

  return getWholesaleOrderById(result.insertId);
};

export const updateWholesaleOrder = async (id, order) => {
  await ensureWholesaleOrderSchema();

  const [result] = await pool.execute(
    `UPDATE wholesale_orders
     SET ${fields.map((field) => `${field} = ?`).join(", ")}
     WHERE id = ?`,
    [...fields.map((field) => order[field] ?? null), Number(id)]
  );

  if (result.affectedRows === 0) {
    return getWholesaleOrderById(id);
  }

  return getWholesaleOrderById(id);
};

export const deleteWholesaleOrder = async (id) => {
  const [result] = await pool.execute(
    "DELETE FROM wholesale_orders WHERE id = ?",
    [Number(id)]
  );

  return result.affectedRows > 0;
};