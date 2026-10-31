CREATE DATABASE IF NOT EXISTS anbira_db
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE anbira_db;

CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
password_hash VARCHAR(255) NOT NULL,
  role ENUM('admin', 'manager') NOT NULL DEFAULT 'manager',
  status ENUM('active', 'inactive') NOT NULL DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS products (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(180) NOT NULL,
  image VARCHAR(500) NULL,
  price DECIMAL(10,2) NULL,
  description TEXT NULL,
  colors JSON NOT NULL,
  sizes JSON NOT NULL,
  product_type ENUM('sale', 'rental', 'both') NOT NULL DEFAULT 'sale',
  status ENUM('active', 'unavailable', 'archived') NOT NULL DEFAULT 'active',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS orders (
  id INT AUTO_INCREMENT PRIMARY KEY,
  full_name VARCHAR(255) NOT NULL,
  phone VARCHAR(50) NOT NULL,
  national_id VARCHAR(30) NOT NULL,
  product_id INT UNSIGNED NOT NULL,
  order_type ENUM('sale', 'rental') NOT NULL DEFAULT 'sale',
  quantity INT NOT NULL DEFAULT 1,
  size VARCHAR(50),
  color VARCHAR(100),
  delivery_method VARCHAR(30),
  wilaya VARCHAR(100),
  commune VARCHAR(100),
  address VARCHAR(500),
  notes TEXT,
  status VARCHAR(30) NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (product_id) REFERENCES products(id)
);

CREATE TABLE IF NOT EXISTS tailoring_orders (
  id INT AUTO_INCREMENT PRIMARY KEY,
  full_name VARCHAR(255) NOT NULL,
  phone VARCHAR(50) NOT NULL,
  national_id VARCHAR(30) NULL,
  description TEXT NOT NULL,
  design_image VARCHAR(500),
  quantity INT NOT NULL DEFAULT 1,
  size VARCHAR(50) NOT NULL,
  color VARCHAR(100) NOT NULL,
  delivery_method ENUM('pickup', 'delivery') NOT NULL,
  wilaya VARCHAR(100),
  commune VARCHAR(100),
  address VARCHAR(500),
  notes TEXT,
  status ENUM('new', 'reviewing', 'confirmed', 'preparing', 'completed', 'cancelled') NOT NULL DEFAULT 'new',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS wholesale_orders (
  id INT AUTO_INCREMENT PRIMARY KEY,
  full_name VARCHAR(255) NOT NULL,
  phone VARCHAR(50) NOT NULL,
  national_id VARCHAR(30) NULL,
  order_type ENUM('sample', 'wholesale') NOT NULL,
  product_name VARCHAR(255),
  description TEXT,
  quantity INT NOT NULL DEFAULT 1,
  design_image VARCHAR(500),
  variants JSON NULL,
  size VARCHAR(50) NOT NULL,
  color VARCHAR(100),
  delivery_method ENUM('pickup', 'delivery') NOT NULL,
  wilaya VARCHAR(100),
  commune VARCHAR(100),
  address VARCHAR(500),
  notes TEXT,
  status ENUM('new', 'reviewing', 'confirmed', 'preparing', 'completed', 'cancelled') NOT NULL DEFAULT 'new',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS jobs (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  requirements TEXT,
  status ENUM('open', 'closed') NOT NULL DEFAULT 'open',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS job_applications (
  id INT AUTO_INCREMENT PRIMARY KEY,
  job_id INT NOT NULL,
  full_name VARCHAR(255) NOT NULL,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  national_id VARCHAR(30) NOT NULL,
  phone VARCHAR(50) NOT NULL,
  email VARCHAR(255),
  experience TEXT,
  message TEXT,
  cv_file VARCHAR(500),
  status ENUM('new', 'reviewing', 'accepted', 'rejected') NOT NULL DEFAULT 'new',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (job_id) REFERENCES jobs(id) ON DELETE CASCADE
);
