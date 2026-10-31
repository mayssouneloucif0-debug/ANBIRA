import pool from "../config/mysql.js";

const parseJson = (value) => {
  if (typeof value !== "string") {
    return value || [];
  }

  try {
    return JSON.parse(value);
  } catch {
    return [];
  }
};

const mapProduct = (product) => {
  if (!product) {
    return null;
  }

  return {
    ...product,
    colors: parseJson(product.colors),
    sizes: parseJson(product.sizes),
  };
};

export const getAllProducts = async () => {
  const [rows] = await pool.query(
    "SELECT * FROM products ORDER BY id DESC"
  );

  return rows.map(mapProduct);
};

export const getProductById = async (id) => {
  const [rows] = await pool.execute(
    "SELECT * FROM products WHERE id = ?",
    [Number(id)]
  );

  return mapProduct(rows[0]);
};

export const createProduct = async (data) => {
  const [result] = await pool.execute(
    `
    INSERT INTO products (
      name,
      image,
      price,
      description,
      colors,
      sizes,
      product_type,
      status
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `,
    [
      data.name.trim(),
      data.image || null,
      data.price === null || data.price === undefined
        ? null
        : Number(data.price),
      data.description || null,
      JSON.stringify(data.colors || []),
      JSON.stringify(data.sizes || []),
      data.productType || "sale",
      data.status || "active",
    ]
  );

  return getProductById(result.insertId);
};

export const updateProduct = async (id, data) => {
  const product = await getProductById(id);

  if (!product) {
    return null;
  }

  const next = {
    name: data.name?.trim() || product.name,
    image: data.image ?? product.image,
    price:
      data.price === undefined
        ? product.price
        : data.price === null
          ? null
          : Number(data.price),
    description: data.description ?? product.description,
    colors: data.colors ?? product.colors,
    sizes: data.sizes ?? product.sizes,
    productType:
      data.productType ?? product.product_type,
    status: data.status ?? product.status,
  };

  await pool.execute(
    `
    UPDATE products
    SET
      name = ?,
      image = ?,
      price = ?,
      description = ?,
      colors = ?,
      sizes = ?,
      product_type = ?,
      status = ?
    WHERE id = ?
    `,
    [
      next.name,
      next.image,
      next.price,
      next.description,
      JSON.stringify(next.colors),
      JSON.stringify(next.sizes),
      next.productType,
      next.status,
      Number(id),
    ]
  );

  return getProductById(id);
};

export const deleteProduct = async (id) => {
  const [result] = await pool.execute(
    "DELETE FROM products WHERE id = ?",
    [Number(id)]
  );

  return result.affectedRows > 0;
};