import pool from "../config/mysql.js";
import { ensureDatabaseColumns } from "../utils/ensureDatabaseColumns.js";

let schemaReadyPromise;

const ensureOrderSchema = async () => {
  if (!schemaReadyPromise) {
    schemaReadyPromise = ensureDatabaseColumns("orders", {
      national_id: "VARCHAR(30) NULL",
      order_type: "ENUM('sale', 'rental') NOT NULL DEFAULT 'sale'",
    }).catch((error) => {
      schemaReadyPromise = null;
      throw error;
    });
  }

  await schemaReadyPromise;
};

export const getAllOrders = async () => {
  await ensureOrderSchema();

  const [rows] = await pool.query(`
    SELECT
      o.*,
      p.name AS product_name,
      p.price AS product_price,
      p.image AS product_image
    FROM orders o
    LEFT JOIN products p
      ON o.product_id = p.id
    ORDER BY o.id DESC
  `);

  console.log("GET ALL ORDERS:", rows);

  return rows;
};

export const getOrderById = async (id) => {
  await ensureOrderSchema();

  const [rows] = await pool.execute(
    `
    SELECT
      o.*,
      p.name AS product_name,
      p.price AS product_price,
      p.image AS product_image
    FROM orders o
    LEFT JOIN products p
      ON o.product_id = p.id
    WHERE o.id = ?
    `,
    [Number(id)]
  );

  return rows[0] || null;
};

export const createOrder = async (data) => {
  await ensureOrderSchema();

  console.log("CREATING ORDER:", data);

  const [result] = await pool.execute(
    `
    INSERT INTO orders (
      full_name,
      phone,
      national_id,
      product_id,
      order_type,
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
      Number(data.productId),
      data.orderType,
      Number(data.quantity || 1),
      data.size || null,
      data.color || null,
      data.deliveryMethod || null,
      data.wilaya || null,
      data.commune || null,
      data.address || null,
      data.notes || null,
    ]
  );

  console.log("ORDER INSERTED, ID:", result.insertId);

  const order = await getOrderById(result.insertId);

  console.log("CREATED ORDER:", order);

  return order;
};

export const updateOrder = async (id, data) => {
  await ensureOrderSchema();

  const order = await getOrderById(id);

  if (!order) {
    return null;
  }

  const status = data.status || order.status;

  const notes =
    data.notes !== undefined
      ? data.notes
      : order.notes;

  await pool.execute(
    `
    UPDATE orders
    SET
      status = ?,
      notes = ?
    WHERE id = ?
    `,
    [
      status,
      notes,
      Number(id),
    ]
  );

  return getOrderById(id);
};

export const deleteOrder = async (id) => {
  await ensureOrderSchema();

  const [result] = await pool.execute(
    "DELETE FROM orders WHERE id = ?",
    [Number(id)]
  );

  return result.affectedRows > 0;
};