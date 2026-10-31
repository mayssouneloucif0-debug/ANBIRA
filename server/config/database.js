
import bcrypt from "bcryptjs";
import Database from "better-sqlite3";
import path from "node:path";

const databasePath = path.join(
  process.cwd(),
  "server",
  "data",
  "anbira.db"
);

const db = new Database(databasePath);

db.pragma("journal_mode = WAL");
db.pragma("foreign_keys = ON");

db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'admin' CHECK(role IN ('admin', 'manager')),
    status TEXT NOT NULL DEFAULT 'active' CHECK(status IN ('active', 'inactive')),
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    image TEXT,
    price REAL,
    description TEXT,
    colors TEXT NOT NULL DEFAULT '[]',
    sizes TEXT NOT NULL DEFAULT '[]',
    product_type TEXT NOT NULL DEFAULT 'sale' CHECK(product_type IN ('sale', 'rental', 'both')),
    status TEXT NOT NULL DEFAULT 'active' CHECK(status IN ('active', 'unavailable', 'archived')),
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS product_orders (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    customer_name TEXT NOT NULL,
    phone TEXT NOT NULL,
    product_id INTEGER NOT NULL,
    quantity INTEGER NOT NULL DEFAULT 1,
    size TEXT,
    color TEXT,
    delivery_method TEXT,
    wilaya TEXT,
    commune TEXT,
    address TEXT,
    notes TEXT,
    status TEXT NOT NULL DEFAULT 'pending',
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (product_id) REFERENCES products(id)
  );

  CREATE TABLE IF NOT EXISTS orders (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    full_name TEXT NOT NULL,
    phone TEXT NOT NULL,
    national_id TEXT NOT NULL,
    product_id INTEGER NOT NULL,
    order_type TEXT NOT NULL DEFAULT 'sale' CHECK(order_type IN ('sale', 'rental')),
    quantity INTEGER NOT NULL DEFAULT 1,
    size TEXT,
    color TEXT,
    delivery_method TEXT,
    wilaya TEXT,
    commune TEXT,
    address TEXT,
    notes TEXT,
    status TEXT NOT NULL DEFAULT 'pending',
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (product_id) REFERENCES products(id)
  );

  CREATE TABLE IF NOT EXISTS tailoring_orders (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    customer_name TEXT NOT NULL,
    phone TEXT NOT NULL,
    national_id TEXT,
    design_image TEXT,
    model_description TEXT,
    size TEXT,
    color TEXT,
    quantity INTEGER NOT NULL DEFAULT 1,
    delivery_method TEXT,
    wilaya TEXT,
    commune TEXT,
    address TEXT,
    notes TEXT,
    status TEXT NOT NULL DEFAULT 'pending',
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS wholesale_orders (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    customer_name TEXT NOT NULL,
    phone TEXT NOT NULL,
    national_id TEXT,
    product_design TEXT NOT NULL,
    quantity INTEGER NOT NULL,
    size TEXT,
    variants TEXT,
    details TEXT,
    status TEXT NOT NULL DEFAULT 'pending',
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS jobs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    requirements TEXT NOT NULL DEFAULT '[]',
    status TEXT NOT NULL DEFAULT 'open',
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS job_applications (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    applicant_name TEXT NOT NULL,
    phone TEXT NOT NULL,
    job_id INTEGER NOT NULL,
    details TEXT,
    cv_file TEXT,
    status TEXT NOT NULL DEFAULT 'pending',
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (job_id) REFERENCES jobs(id)
  );
`);

if (
  db.prepare("SELECT COUNT(*) AS count FROM products").get().count === 0
) {
  const insert = db.prepare(`
    INSERT INTO products
    (
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
  `);

  [
    [
      "فستان ANBIRA",
      "/images/product-1.jpg",
      null,
      "قطعة أنيقة مصممة بعناية مع الاهتمام بالتفاصيل وجودة الخياطة.",
      ["بنفسجي", "أسود", "أبيض"],
      ["S", "M", "L", "XL"],
      "sale",
      "active",
    ],
    [
      "قطعة أنيقة",
      "/images/product-2.jpg",
      null,
      "قطعة مميزة مناسبة للمناسبات ومتوفرة للإيجار حسب التوفر.",
      ["بنفسجي", "أسود"],
      ["S", "M", "L"],
      "rental",
      "active",
    ],
    [
      "تصميم ANBIRA",
      "/images/product-3.jpg",
      null,
      "تصميم أنيق يجمع بين البساطة والتفاصيل الراقية.",
      ["بنفسجي", "رمادي"],
      ["M", "L", "XL"],
      "both",
      "active",
    ],
  ].forEach((product) =>
    insert.run(
      product[0],
      product[1],
      product[2],
      product[3],
      JSON.stringify(product[4]),
      JSON.stringify(product[5]),
      product[6],
      product[7]
    )
  );
}

if (
  process.env.ADMIN_PASSWORD &&
  db.prepare("SELECT COUNT(*) AS count FROM users").get().count === 0
) {
  db.prepare(`
    INSERT INTO users
    (name, email, password_hash, role)
    VALUES (?, ?, ?, 'admin')
  `).run(
    process.env.ADMIN_NAME || "مديرة ANBIRA",
    process.env.ADMIN_EMAIL || "admin@anbira.local",
    bcrypt.hashSync(process.env.ADMIN_PASSWORD, 12)
  );
}

export default db;

