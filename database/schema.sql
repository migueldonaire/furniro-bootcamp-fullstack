-- Furniro: database schema (PostgreSQL 17)
-- Based on the class diagram: docs/class-diagram.md
-- Run it first, then seed.sql. It deletes everything and starts again.

DROP TABLE IF EXISTS order_lines, order_addresses, orders,
  product_images, products, categories, user_addresses, users CASCADE;

-- Accounts of customers and administrators (one table, one role)
CREATE TABLE users (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name          TEXT NOT NULL,
  last_name     TEXT NOT NULL,
  email         TEXT NOT NULL,
  password_hash TEXT NOT NULL,                 -- never the plain password
  role          TEXT NOT NULL DEFAULT 'CUSTOMER'
                CHECK (role IN ('CUSTOMER', 'ADMIN')),
  phone         TEXT,
  -- New accounts wait until an admin activates them (no emails in the MVP)
  status        TEXT NOT NULL DEFAULT 'PENDING'
                CHECK (status IN ('PENDING', 'ACTIVE', 'INACTIVE')),
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);
-- The email is unique and does not care about upper/lower case
CREATE UNIQUE INDEX users_email_unique ON users (lower(email));

-- Usual address of a user: 0 or 1 per user
CREATE TABLE user_addresses (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID NOT NULL UNIQUE REFERENCES users (id) ON DELETE CASCADE,
  street      TEXT NOT NULL,
  city        TEXT NOT NULL,
  province    TEXT,
  postal_code TEXT NOT NULL,
  country     TEXT NOT NULL DEFAULT 'ES'
);

-- Categories: there is no CRUD in the MVP, they come from seed.sql
CREATE TABLE categories (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name        TEXT NOT NULL UNIQUE,
  description TEXT
);

-- Products: deleting one sets status = 'INACTIVE' (logical delete)
CREATE TABLE products (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id UUID NOT NULL REFERENCES categories (id),
  name        TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  sku         TEXT NOT NULL UNIQUE,
  base_price  NUMERIC(10, 2) NOT NULL CHECK (base_price >= 0), -- without VAT
  tax_rate    NUMERIC(5, 2) NOT NULL DEFAULT 21,              -- 21 = 21 %
  currency    CHAR(3) NOT NULL DEFAULT 'EUR',
  stock       INTEGER NOT NULL DEFAULT 0 CHECK (stock >= 0),
  status      TEXT NOT NULL DEFAULT 'ACTIVE'
              CHECK (status IN ('ACTIVE', 'INACTIVE')),
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Product images: the file lives in a storage service, here only the URL
CREATE TABLE product_images (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES products (id) ON DELETE CASCADE,
  url        TEXT NOT NULL,
  sort_order INTEGER NOT NULL DEFAULT 0,
  is_primary BOOLEAN NOT NULL DEFAULT false
);
-- Only one primary image per product
CREATE UNIQUE INDEX product_images_one_primary
  ON product_images (product_id) WHERE is_primary;

-- Orders. Subtotal, VAT and total are NOT stored: they are calculated from the lines.
-- Status list proposed by the designs (pending PO confirmation).
CREATE TABLE orders (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       UUID NOT NULL REFERENCES users (id),
  order_date    TIMESTAMPTZ NOT NULL DEFAULT now(),
  status        TEXT NOT NULL DEFAULT 'PENDING'
                CHECK (status IN ('PENDING', 'SHIPPED', 'DELIVERED', 'CANCELLED')),
  shipping_cost NUMERIC(10, 2) NOT NULL,       -- VAT included, copied when ordering
  currency      CHAR(3) NOT NULL DEFAULT 'EUR'
);

-- Shipping address of an order: a COPY, exactly 1 per order
CREATE TABLE order_addresses (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id    UUID NOT NULL UNIQUE REFERENCES orders (id) ON DELETE CASCADE,
  full_name   TEXT NOT NULL,
  street      TEXT NOT NULL,
  city        TEXT NOT NULL,
  province    TEXT,
  postal_code TEXT NOT NULL,
  country     TEXT NOT NULL DEFAULT 'ES'
);

-- Order lines: name, SKU, price and VAT are historical copies
CREATE TABLE order_lines (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id     UUID NOT NULL REFERENCES orders (id) ON DELETE CASCADE,
  product_id   UUID NOT NULL REFERENCES products (id),
  product_name TEXT NOT NULL,
  sku          TEXT NOT NULL,
  quantity     INTEGER NOT NULL CHECK (quantity > 0),
  unit_price   NUMERIC(10, 2) NOT NULL,        -- without VAT
  tax_rate     NUMERIC(5, 2) NOT NULL,
  currency     CHAR(3) NOT NULL DEFAULT 'EUR'
);

CREATE INDEX products_category_idx ON products (category_id);
CREATE INDEX orders_user_idx ON orders (user_id);
CREATE INDEX order_lines_order_idx ON order_lines (order_id);
