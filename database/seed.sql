-- Furniro: test data for development and staging
-- Run schema.sql first. Generated from the class diagram.
--
-- Every account has the password: Furniro123
--   Admin:    luis@furniro.com   (ADMIN)
--   Customer: ana@mail.com       (CUSTOMER, 2 orders)
--   Customer: pedro@mail.com     (CUSTOMER, no orders)
--
-- Products used in the user stories:
--   "Silla Nora"         100 EUR without VAT, 21 % VAT, 5 units, category "Sillas"
--   "Mesa Asgaard"       250 EUR without VAT, 21 % VAT, 3 units, category "Mesas"
--   "Lámpara Syltherine" INACTIVE (does not appear in the shop)
--
-- Images: database/images/. The URLs point to the public repo on GitHub;
-- database/scripts/upload-images.mjs uploads them to Supabase Storage.
--
-- The ids are fixed so that you can copy them into Postman:
--   users a0000000-..., categories c0000000-..., products d0000000-..., orders f0000000-...


-- Users (13 accounts: 2 ADMIN, 11 CUSTOMER)
INSERT INTO users (id, name, last_name, email, password_hash, role, phone, created_at) VALUES
  ('a0000000-0000-4000-8000-000000000001', 'Luis', 'Martínez', 'luis@furniro.com', '$argon2id$v=19$m=65536,t=3,p=4$3IWxOUm7AXSFMsdIKU7gYA$yyGS0m2EhbIBsEcBvCPtL3HphMmVamTvkqiwHwDnZSs', 'ADMIN', '600111222', '2026-10-01 10:00:00+01'),
  ('a0000000-0000-4000-8000-000000000002', 'Ana', 'López', 'ana@mail.com', '$argon2id$v=19$m=65536,t=3,p=4$3IWxOUm7AXSFMsdIKU7gYA$yyGS0m2EhbIBsEcBvCPtL3HphMmVamTvkqiwHwDnZSs', 'CUSTOMER', '611223344', '2026-10-03 10:00:00+01'),
  ('a0000000-0000-4000-8000-000000000003', 'Pedro', 'García', 'pedro@mail.com', '$argon2id$v=19$m=65536,t=3,p=4$3IWxOUm7AXSFMsdIKU7gYA$yyGS0m2EhbIBsEcBvCPtL3HphMmVamTvkqiwHwDnZSs', 'CUSTOMER', NULL, '2026-10-05 10:00:00+01'),
  ('a0000000-0000-4000-8000-000000000004', 'Lucía', 'Fernández', 'lucia@mail.com', '$argon2id$v=19$m=65536,t=3,p=4$3IWxOUm7AXSFMsdIKU7gYA$yyGS0m2EhbIBsEcBvCPtL3HphMmVamTvkqiwHwDnZSs', 'CUSTOMER', '622334455', '2026-10-07 10:00:00+01'),
  ('a0000000-0000-4000-8000-000000000005', 'Javier', 'Ruiz', 'javier@mail.com', '$argon2id$v=19$m=65536,t=3,p=4$3IWxOUm7AXSFMsdIKU7gYA$yyGS0m2EhbIBsEcBvCPtL3HphMmVamTvkqiwHwDnZSs', 'CUSTOMER', NULL, '2026-10-09 10:00:00+01'),
  ('a0000000-0000-4000-8000-000000000006', 'Marta', 'Sánchez', 'marta@mail.com', '$argon2id$v=19$m=65536,t=3,p=4$3IWxOUm7AXSFMsdIKU7gYA$yyGS0m2EhbIBsEcBvCPtL3HphMmVamTvkqiwHwDnZSs', 'CUSTOMER', '633445566', '2026-10-11 10:00:00+01'),
  ('a0000000-0000-4000-8000-000000000007', 'Carlos', 'Gómez', 'carlos@mail.com', '$argon2id$v=19$m=65536,t=3,p=4$3IWxOUm7AXSFMsdIKU7gYA$yyGS0m2EhbIBsEcBvCPtL3HphMmVamTvkqiwHwDnZSs', 'CUSTOMER', NULL, '2026-10-13 10:00:00+01'),
  ('a0000000-0000-4000-8000-000000000008', 'Elena', 'Díaz', 'elena@mail.com', '$argon2id$v=19$m=65536,t=3,p=4$3IWxOUm7AXSFMsdIKU7gYA$yyGS0m2EhbIBsEcBvCPtL3HphMmVamTvkqiwHwDnZSs', 'CUSTOMER', '644556677', '2026-10-15 10:00:00+01'),
  ('a0000000-0000-4000-8000-000000000009', 'Pablo', 'Moreno', 'pablo@mail.com', '$argon2id$v=19$m=65536,t=3,p=4$3IWxOUm7AXSFMsdIKU7gYA$yyGS0m2EhbIBsEcBvCPtL3HphMmVamTvkqiwHwDnZSs', 'CUSTOMER', NULL, '2026-10-17 10:00:00+01'),
  ('a0000000-0000-4000-8000-000000000010', 'Sara', 'Navarro', 'sara@mail.com', '$argon2id$v=19$m=65536,t=3,p=4$3IWxOUm7AXSFMsdIKU7gYA$yyGS0m2EhbIBsEcBvCPtL3HphMmVamTvkqiwHwDnZSs', 'CUSTOMER', '655667788', '2026-10-19 10:00:00+01'),
  ('a0000000-0000-4000-8000-000000000011', 'Diego', 'Torres', 'diego@mail.com', '$argon2id$v=19$m=65536,t=3,p=4$3IWxOUm7AXSFMsdIKU7gYA$yyGS0m2EhbIBsEcBvCPtL3HphMmVamTvkqiwHwDnZSs', 'CUSTOMER', NULL, '2026-10-21 10:00:00+01'),
  ('a0000000-0000-4000-8000-000000000012', 'Laura', 'Romero', 'laura@mail.com', '$argon2id$v=19$m=65536,t=3,p=4$3IWxOUm7AXSFMsdIKU7gYA$yyGS0m2EhbIBsEcBvCPtL3HphMmVamTvkqiwHwDnZSs', 'CUSTOMER', '666778899', '2026-10-23 10:00:00+01'),
  ('a0000000-0000-4000-8000-000000000013', 'Marina', 'Ortega', 'marina@furniro.com', '$argon2id$v=19$m=65536,t=3,p=4$3IWxOUm7AXSFMsdIKU7gYA$yyGS0m2EhbIBsEcBvCPtL3HphMmVamTvkqiwHwDnZSs', 'ADMIN', NULL, '2026-10-25 10:00:00+01');

-- Usual addresses (only some users have one)
INSERT INTO user_addresses (id, user_id, street, city, province, postal_code, country) VALUES
  ('a1000000-0000-4000-8000-000000000001', 'a0000000-0000-4000-8000-000000000002', 'Calle Colón 12, 3º', 'Valencia', 'Valencia', '46001', 'ES'),
  ('a1000000-0000-4000-8000-000000000002', 'a0000000-0000-4000-8000-000000000004', 'Avenida del Puerto 45', 'Madrid', 'Madrid', '28001', 'ES'),
  ('a1000000-0000-4000-8000-000000000003', 'a0000000-0000-4000-8000-000000000005', 'Calle de la Paz 7', 'Alicante', 'Alicante', '03001', 'ES'),
  ('a1000000-0000-4000-8000-000000000004', 'a0000000-0000-4000-8000-000000000006', 'Plaza Mayor 2, 1º B', 'Castellón de la Plana', 'Castellón', '12001', 'ES'),
  ('a1000000-0000-4000-8000-000000000005', 'a0000000-0000-4000-8000-000000000008', 'Calle Sorní 21', 'Sevilla', 'Sevilla', '41001', 'ES'),
  ('a1000000-0000-4000-8000-000000000006', 'a0000000-0000-4000-8000-000000000010', 'Gran Vía 30, 5º A', 'Barcelona', 'Barcelona', '08001', 'ES'),
  ('a1000000-0000-4000-8000-000000000007', 'a0000000-0000-4000-8000-000000000012', 'Calle Russafa 9', 'Valencia', 'Valencia', '46001', 'ES');

-- Categories (no CRUD in the MVP)
INSERT INTO categories (id, name, description) VALUES
  ('c0000000-0000-4000-8000-000000000001', 'Sillas', 'Sillas de comedor, oficina y taburetes'),
  ('c0000000-0000-4000-8000-000000000002', 'Mesas', 'Mesas de comedor, centro y auxiliares'),
  ('c0000000-0000-4000-8000-000000000003', 'Sofás', 'Sofás y sillones'),
  ('c0000000-0000-4000-8000-000000000004', 'Lámparas', 'Lámparas de techo, pie y mesa'),
  ('c0000000-0000-4000-8000-000000000005', 'Dormitorio', 'Camas, mesitas y cómodas'),
  ('c0000000-0000-4000-8000-000000000006', 'Decoración', 'Espejos, jarrones y cojines');

-- Products (32: 29 ACTIVE, some without stock, 3 INACTIVE)
INSERT INTO products (id, category_id, name, description, sku, base_price, tax_rate, currency, stock, status, created_at, updated_at) VALUES
  ('d0000000-0000-4000-8000-000000000001', 'c0000000-0000-4000-8000-000000000001', 'Silla Nora', 'Silla de diseño con asiento envolvente blanco y patas de madera.', 'FUR-SIL-001', 100, 21, 'EUR', 5, 'ACTIVE', '2026-10-01 09:00:00+01', '2026-10-01 09:00:00+01'),
  ('d0000000-0000-4000-8000-000000000002', 'c0000000-0000-4000-8000-000000000001', 'Silla Leviosa', 'Silla de comedor tapizada en gris claro.', 'FUR-SIL-002', 65, 21, 'EUR', 12, 'ACTIVE', '2026-10-01 09:00:00+01', '2026-10-01 09:00:00+01'),
  ('d0000000-0000-4000-8000-000000000003', 'c0000000-0000-4000-8000-000000000001', 'Taburete Lolito', 'Taburete bajo de madera de abedul. Agotado.', 'FUR-TAB-003', 45, 21, 'EUR', 0, 'ACTIVE', '2026-10-01 09:00:00+01', '2026-10-01 09:00:00+01'),
  ('d0000000-0000-4000-8000-000000000004', 'c0000000-0000-4000-8000-000000000001', 'Silla Respira', 'Silla blanca nórdica con patas de madera.', 'FUR-SIL-004', 80, 21, 'EUR', 8, 'ACTIVE', '2026-10-01 09:00:00+01', '2026-10-01 09:00:00+01'),
  ('d0000000-0000-4000-8000-000000000005', 'c0000000-0000-4000-8000-000000000001', 'Sillón Grifo', 'Sillón orejero de terciopelo azul.', 'FUR-SIL-005', 190, 21, 'EUR', 2, 'ACTIVE', '2026-10-01 09:00:00+01', '2026-10-01 09:00:00+01'),
  ('d0000000-0000-4000-8000-000000000006', 'c0000000-0000-4000-8000-000000000002', 'Mesa Asgaard', 'Mesa de comedor extensible para 6 personas.', 'FUR-MES-006', 250, 21, 'EUR', 3, 'ACTIVE', '2026-10-01 09:00:00+01', '2026-10-01 09:00:00+01'),
  ('d0000000-0000-4000-8000-000000000007', 'c0000000-0000-4000-8000-000000000002', 'Mesa Nube', 'Mesa de centro redonda de nogal.', 'FUR-MES-007', 120, 21, 'EUR', 6, 'ACTIVE', '2026-10-01 09:00:00+01', '2026-10-01 09:00:00+01'),
  ('d0000000-0000-4000-8000-000000000008', 'c0000000-0000-4000-8000-000000000002', 'Mesa Pingky', 'Mesa auxiliar redonda de madera, de tres patas.', 'FUR-MES-008', 75, 21, 'EUR', 10, 'ACTIVE', '2026-10-01 09:00:00+01', '2026-10-01 09:00:00+01'),
  ('d0000000-0000-4000-8000-000000000009', 'c0000000-0000-4000-8000-000000000002', 'Mesa Potty', 'Mesa de comedor blanca para 4 personas.', 'FUR-MES-009', 310, 21, 'EUR', 1, 'ACTIVE', '2026-10-01 09:00:00+01', '2026-10-01 09:00:00+01'),
  ('d0000000-0000-4000-8000-000000000010', 'c0000000-0000-4000-8000-000000000002', 'Escritorio Bolt', 'Escritorio blanco largo con espacio para dos.', 'FUR-ESC-010', 160, 21, 'EUR', 7, 'ACTIVE', '2026-10-01 09:00:00+01', '2026-10-01 09:00:00+01'),
  ('d0000000-0000-4000-8000-000000000011', 'c0000000-0000-4000-8000-000000000003', 'Sofá Asgaard', 'Sofá de tres plazas en lino beige.', 'FUR-SOF-011', 890, 21, 'EUR', 2, 'ACTIVE', '2026-10-01 09:00:00+01', '2026-10-01 09:00:00+01'),
  ('d0000000-0000-4000-8000-000000000012', 'c0000000-0000-4000-8000-000000000003', 'Sofá Kimbra', 'Sofá modular blanco con chaise longue.', 'FUR-SOF-012', 640, 21, 'EUR', 4, 'ACTIVE', '2026-10-01 09:00:00+01', '2026-10-01 09:00:00+01'),
  ('d0000000-0000-4000-8000-000000000013', 'c0000000-0000-4000-8000-000000000003', 'Sofá Bubble', 'Sofá de dos plazas con tapizado de flores. Agotado.', 'FUR-SOF-013', 280, 21, 'EUR', 0, 'ACTIVE', '2026-10-01 09:00:00+01', '2026-10-01 09:00:00+01'),
  ('d0000000-0000-4000-8000-000000000014', 'c0000000-0000-4000-8000-000000000003', 'Sofá Tortuga', 'Sofá rinconera gris. Ya no se vende.', 'FUR-SOF-014', 1150, 21, 'EUR', 1, 'INACTIVE', '2026-10-01 09:00:00+01', '2026-10-01 09:00:00+01'),
  ('d0000000-0000-4000-8000-000000000015', 'c0000000-0000-4000-8000-000000000004', 'Lámpara Syltherine', 'Lámpara de techo de ratán. Desactivada.', 'FUR-LAM-015', 55, 21, 'EUR', 9, 'INACTIVE', '2026-10-01 09:00:00+01', '2026-10-01 09:00:00+01'),
  ('d0000000-0000-4000-8000-000000000016', 'c0000000-0000-4000-8000-000000000004', 'Lámpara Luna', 'Lámpara de techo industrial blanca.', 'FUR-LAM-016', 89, 21, 'EUR', 15, 'ACTIVE', '2026-10-01 09:00:00+01', '2026-10-01 09:00:00+01'),
  ('d0000000-0000-4000-8000-000000000017', 'c0000000-0000-4000-8000-000000000004', 'Lámpara Faro', 'Lámpara de pie con pantalla blanca.', 'FUR-LAM-017', 135, 21, 'EUR', 5, 'ACTIVE', '2026-10-01 09:00:00+01', '2026-10-01 09:00:00+01'),
  ('d0000000-0000-4000-8000-000000000018', 'c0000000-0000-4000-8000-000000000004', 'Flexo Duna', 'Lámpara de lectura con brazo negro.', 'FUR-FLE-018', 39, 21, 'EUR', 20, 'ACTIVE', '2026-10-01 09:00:00+01', '2026-10-01 09:00:00+01'),
  ('d0000000-0000-4000-8000-000000000019', 'c0000000-0000-4000-8000-000000000005', 'Cama Ottawa', 'Cama de matrimonio con cabecero tapizado.', 'FUR-CAM-019', 450, 21, 'EUR', 3, 'ACTIVE', '2026-10-01 09:00:00+01', '2026-10-01 09:00:00+01'),
  ('d0000000-0000-4000-8000-000000000020', 'c0000000-0000-4000-8000-000000000005', 'Banco Kioto', 'Banco bajo blanco para el dormitorio.', 'FUR-BAN-020', 70, 21, 'EUR', 11, 'ACTIVE', '2026-10-01 09:00:00+01', '2026-10-01 09:00:00+01'),
  ('d0000000-0000-4000-8000-000000000021', 'c0000000-0000-4000-8000-000000000005', 'Cómoda Oslo', 'Cómoda de madera clara con dos cajones.', 'FUR-COM-021', 230, 21, 'EUR', 4, 'ACTIVE', '2026-10-01 09:00:00+01', '2026-10-01 09:00:00+01'),
  ('d0000000-0000-4000-8000-000000000022', 'c0000000-0000-4000-8000-000000000005', 'Funda nórdica Nilo', 'Funda nórdica rosa con estampado infantil. Agotada.', 'FUR-FUN-022', 60, 21, 'EUR', 0, 'ACTIVE', '2026-10-01 09:00:00+01', '2026-10-01 09:00:00+01'),
  ('d0000000-0000-4000-8000-000000000023', 'c0000000-0000-4000-8000-000000000006', 'Espejo Sol', 'Espejo rectangular con marco de madera clara.', 'FUR-ESP-023', 95, 21, 'EUR', 6, 'ACTIVE', '2026-10-01 09:00:00+01', '2026-10-01 09:00:00+01'),
  ('d0000000-0000-4000-8000-000000000024', 'c0000000-0000-4000-8000-000000000006', 'Jarrón Brisa', 'Jarrón blanco de cerámica con formas redondas.', 'FUR-JAR-024', 25, 21, 'EUR', 30, 'ACTIVE', '2026-10-01 09:00:00+01', '2026-10-01 09:00:00+01'),
  ('d0000000-0000-4000-8000-000000000025', 'c0000000-0000-4000-8000-000000000006', 'Cojín Coral', 'Cojín de algodón 45x45 cm.', 'FUR-COJ-025', 18, 21, 'EUR', 40, 'ACTIVE', '2026-10-01 09:00:00+01', '2026-10-01 09:00:00+01'),
  ('d0000000-0000-4000-8000-000000000026', 'c0000000-0000-4000-8000-000000000006', 'Alfombra Sahara', 'Alfombra de yute de 160x230 cm.', 'FUR-ALF-026', 120, 21, 'EUR', 5, 'ACTIVE', '2026-10-01 09:00:00+01', '2026-10-01 09:00:00+01'),
  ('d0000000-0000-4000-8000-000000000027', 'c0000000-0000-4000-8000-000000000006', 'Taza Muggo', 'Taza de cerámica con interior azul. Desactivada.', 'FUR-TAZ-027', 12, 21, 'EUR', 0, 'INACTIVE', '2026-10-01 09:00:00+01', '2026-10-01 09:00:00+01'),
  ('d0000000-0000-4000-8000-000000000028', 'c0000000-0000-4000-8000-000000000006', 'Estantería Lira', 'Estantería metálica negra de cinco baldas.', 'FUR-EST-028', 175, 21, 'EUR', 3, 'ACTIVE', '2026-10-01 09:00:00+01', '2026-10-01 09:00:00+01'),
  ('d0000000-0000-4000-8000-000000000029', 'c0000000-0000-4000-8000-000000000003', 'Sofá Chester', 'Sofá capitoné de tres plazas en blanco roto.', 'FUR-SOF-029', 720, 21, 'EUR', 3, 'ACTIVE', '2026-10-01 09:00:00+01', '2026-10-01 09:00:00+01'),
  ('d0000000-0000-4000-8000-000000000030', 'c0000000-0000-4000-8000-000000000003', 'Sofá Otoño', 'Sofá de piel color naranja.', 'FUR-SOF-030', 980, 21, 'EUR', 2, 'ACTIVE', '2026-10-01 09:00:00+01', '2026-10-01 09:00:00+01'),
  ('d0000000-0000-4000-8000-000000000031', 'c0000000-0000-4000-8000-000000000003', 'Conjunto Bali', 'Conjunto de exterior: sofá, dos sillones y mesa.', 'FUR-CON-031', 1290, 21, 'EUR', 1, 'ACTIVE', '2026-10-01 09:00:00+01', '2026-10-01 09:00:00+01'),
  ('d0000000-0000-4000-8000-000000000032', 'c0000000-0000-4000-8000-000000000003', 'Sillones Cuerda', 'Pareja de sillones de exterior de madera y cuerda.', 'FUR-SIL-032', 540, 21, 'EUR', 4, 'ACTIVE', '2026-10-01 09:00:00+01', '2026-10-01 09:00:00+01');

-- Product images: every product has 1 or 2. To change the folder, see database/README.md
INSERT INTO product_images (id, product_id, url, sort_order, is_primary) VALUES
  ('e0000000-0000-4000-8000-000000000001', 'd0000000-0000-4000-8000-000000000001', 'https://raw.githubusercontent.com/migueldonaire/furniro-bootcamp-fullstack/main/database/images/silla-nora-1.jpg', 0, true),
  ('e0000000-0000-4000-8000-000000000002', 'd0000000-0000-4000-8000-000000000001', 'https://raw.githubusercontent.com/migueldonaire/furniro-bootcamp-fullstack/main/database/images/silla-nora-2.jpg', 1, false),
  ('e0000000-0000-4000-8000-000000000003', 'd0000000-0000-4000-8000-000000000002', 'https://raw.githubusercontent.com/migueldonaire/furniro-bootcamp-fullstack/main/database/images/silla-leviosa-1.jpg', 0, true),
  ('e0000000-0000-4000-8000-000000000004', 'd0000000-0000-4000-8000-000000000003', 'https://raw.githubusercontent.com/migueldonaire/furniro-bootcamp-fullstack/main/database/images/taburete-lolito-1.jpg', 0, true),
  ('e0000000-0000-4000-8000-000000000005', 'd0000000-0000-4000-8000-000000000003', 'https://raw.githubusercontent.com/migueldonaire/furniro-bootcamp-fullstack/main/database/images/taburete-lolito-2.jpg', 1, false),
  ('e0000000-0000-4000-8000-000000000006', 'd0000000-0000-4000-8000-000000000004', 'https://raw.githubusercontent.com/migueldonaire/furniro-bootcamp-fullstack/main/database/images/silla-respira-1.jpg', 0, true),
  ('e0000000-0000-4000-8000-000000000007', 'd0000000-0000-4000-8000-000000000005', 'https://raw.githubusercontent.com/migueldonaire/furniro-bootcamp-fullstack/main/database/images/sillon-grifo-1.jpg', 0, true),
  ('e0000000-0000-4000-8000-000000000008', 'd0000000-0000-4000-8000-000000000005', 'https://raw.githubusercontent.com/migueldonaire/furniro-bootcamp-fullstack/main/database/images/sillon-grifo-2.jpg', 1, false),
  ('e0000000-0000-4000-8000-000000000009', 'd0000000-0000-4000-8000-000000000006', 'https://raw.githubusercontent.com/migueldonaire/furniro-bootcamp-fullstack/main/database/images/mesa-asgaard-1.jpg', 0, true),
  ('e0000000-0000-4000-8000-000000000010', 'd0000000-0000-4000-8000-000000000006', 'https://raw.githubusercontent.com/migueldonaire/furniro-bootcamp-fullstack/main/database/images/mesa-asgaard-2.jpg', 1, false),
  ('e0000000-0000-4000-8000-000000000011', 'd0000000-0000-4000-8000-000000000007', 'https://raw.githubusercontent.com/migueldonaire/furniro-bootcamp-fullstack/main/database/images/mesa-nube-1.jpg', 0, true),
  ('e0000000-0000-4000-8000-000000000012', 'd0000000-0000-4000-8000-000000000008', 'https://raw.githubusercontent.com/migueldonaire/furniro-bootcamp-fullstack/main/database/images/mesa-pingky-1.jpg', 0, true),
  ('e0000000-0000-4000-8000-000000000013', 'd0000000-0000-4000-8000-000000000009', 'https://raw.githubusercontent.com/migueldonaire/furniro-bootcamp-fullstack/main/database/images/mesa-potty-1.jpg', 0, true),
  ('e0000000-0000-4000-8000-000000000014', 'd0000000-0000-4000-8000-000000000010', 'https://raw.githubusercontent.com/migueldonaire/furniro-bootcamp-fullstack/main/database/images/escritorio-bolt-1.jpg', 0, true),
  ('e0000000-0000-4000-8000-000000000015', 'd0000000-0000-4000-8000-000000000011', 'https://raw.githubusercontent.com/migueldonaire/furniro-bootcamp-fullstack/main/database/images/sofa-asgaard-1.jpg', 0, true),
  ('e0000000-0000-4000-8000-000000000016', 'd0000000-0000-4000-8000-000000000011', 'https://raw.githubusercontent.com/migueldonaire/furniro-bootcamp-fullstack/main/database/images/sofa-asgaard-2.jpg', 1, false),
  ('e0000000-0000-4000-8000-000000000017', 'd0000000-0000-4000-8000-000000000012', 'https://raw.githubusercontent.com/migueldonaire/furniro-bootcamp-fullstack/main/database/images/sofa-kimbra-1.jpg', 0, true),
  ('e0000000-0000-4000-8000-000000000018', 'd0000000-0000-4000-8000-000000000012', 'https://raw.githubusercontent.com/migueldonaire/furniro-bootcamp-fullstack/main/database/images/sofa-kimbra-2.jpg', 1, false),
  ('e0000000-0000-4000-8000-000000000019', 'd0000000-0000-4000-8000-000000000013', 'https://raw.githubusercontent.com/migueldonaire/furniro-bootcamp-fullstack/main/database/images/sofa-bubble-1.jpg', 0, true),
  ('e0000000-0000-4000-8000-000000000020', 'd0000000-0000-4000-8000-000000000014', 'https://raw.githubusercontent.com/migueldonaire/furniro-bootcamp-fullstack/main/database/images/sofa-tortuga-1.jpg', 0, true),
  ('e0000000-0000-4000-8000-000000000021', 'd0000000-0000-4000-8000-000000000014', 'https://raw.githubusercontent.com/migueldonaire/furniro-bootcamp-fullstack/main/database/images/sofa-tortuga-2.jpg', 1, false),
  ('e0000000-0000-4000-8000-000000000022', 'd0000000-0000-4000-8000-000000000015', 'https://raw.githubusercontent.com/migueldonaire/furniro-bootcamp-fullstack/main/database/images/lampara-syltherine-1.jpg', 0, true),
  ('e0000000-0000-4000-8000-000000000023', 'd0000000-0000-4000-8000-000000000016', 'https://raw.githubusercontent.com/migueldonaire/furniro-bootcamp-fullstack/main/database/images/lampara-luna-1.jpg', 0, true),
  ('e0000000-0000-4000-8000-000000000024', 'd0000000-0000-4000-8000-000000000017', 'https://raw.githubusercontent.com/migueldonaire/furniro-bootcamp-fullstack/main/database/images/lampara-faro-1.jpg', 0, true),
  ('e0000000-0000-4000-8000-000000000025', 'd0000000-0000-4000-8000-000000000018', 'https://raw.githubusercontent.com/migueldonaire/furniro-bootcamp-fullstack/main/database/images/flexo-duna-1.jpg', 0, true),
  ('e0000000-0000-4000-8000-000000000026', 'd0000000-0000-4000-8000-000000000019', 'https://raw.githubusercontent.com/migueldonaire/furniro-bootcamp-fullstack/main/database/images/cama-ottawa-1.jpg', 0, true),
  ('e0000000-0000-4000-8000-000000000027', 'd0000000-0000-4000-8000-000000000019', 'https://raw.githubusercontent.com/migueldonaire/furniro-bootcamp-fullstack/main/database/images/cama-ottawa-2.jpg', 1, false),
  ('e0000000-0000-4000-8000-000000000028', 'd0000000-0000-4000-8000-000000000020', 'https://raw.githubusercontent.com/migueldonaire/furniro-bootcamp-fullstack/main/database/images/banco-kioto-1.jpg', 0, true),
  ('e0000000-0000-4000-8000-000000000029', 'd0000000-0000-4000-8000-000000000021', 'https://raw.githubusercontent.com/migueldonaire/furniro-bootcamp-fullstack/main/database/images/comoda-oslo-1.jpg', 0, true),
  ('e0000000-0000-4000-8000-000000000030', 'd0000000-0000-4000-8000-000000000022', 'https://raw.githubusercontent.com/migueldonaire/furniro-bootcamp-fullstack/main/database/images/funda-nilo-1.jpg', 0, true),
  ('e0000000-0000-4000-8000-000000000031', 'd0000000-0000-4000-8000-000000000023', 'https://raw.githubusercontent.com/migueldonaire/furniro-bootcamp-fullstack/main/database/images/espejo-sol-1.jpg', 0, true),
  ('e0000000-0000-4000-8000-000000000032', 'd0000000-0000-4000-8000-000000000024', 'https://raw.githubusercontent.com/migueldonaire/furniro-bootcamp-fullstack/main/database/images/jarron-brisa-1.jpg', 0, true),
  ('e0000000-0000-4000-8000-000000000033', 'd0000000-0000-4000-8000-000000000025', 'https://raw.githubusercontent.com/migueldonaire/furniro-bootcamp-fullstack/main/database/images/cojin-coral-1.jpg', 0, true),
  ('e0000000-0000-4000-8000-000000000034', 'd0000000-0000-4000-8000-000000000026', 'https://raw.githubusercontent.com/migueldonaire/furniro-bootcamp-fullstack/main/database/images/alfombra-sahara-1.jpg', 0, true),
  ('e0000000-0000-4000-8000-000000000035', 'd0000000-0000-4000-8000-000000000027', 'https://raw.githubusercontent.com/migueldonaire/furniro-bootcamp-fullstack/main/database/images/taza-muggo-1.jpg', 0, true),
  ('e0000000-0000-4000-8000-000000000036', 'd0000000-0000-4000-8000-000000000028', 'https://raw.githubusercontent.com/migueldonaire/furniro-bootcamp-fullstack/main/database/images/estanteria-lira-1.jpg', 0, true),
  ('e0000000-0000-4000-8000-000000000037', 'd0000000-0000-4000-8000-000000000029', 'https://raw.githubusercontent.com/migueldonaire/furniro-bootcamp-fullstack/main/database/images/sofa-chester-1.jpg', 0, true),
  ('e0000000-0000-4000-8000-000000000038', 'd0000000-0000-4000-8000-000000000030', 'https://raw.githubusercontent.com/migueldonaire/furniro-bootcamp-fullstack/main/database/images/sofa-otono-1.jpg', 0, true),
  ('e0000000-0000-4000-8000-000000000039', 'd0000000-0000-4000-8000-000000000031', 'https://raw.githubusercontent.com/migueldonaire/furniro-bootcamp-fullstack/main/database/images/conjunto-bali-1.jpg', 0, true),
  ('e0000000-0000-4000-8000-000000000040', 'd0000000-0000-4000-8000-000000000031', 'https://raw.githubusercontent.com/migueldonaire/furniro-bootcamp-fullstack/main/database/images/conjunto-bali-2.jpg', 1, false),
  ('e0000000-0000-4000-8000-000000000041', 'd0000000-0000-4000-8000-000000000032', 'https://raw.githubusercontent.com/migueldonaire/furniro-bootcamp-fullstack/main/database/images/sillones-cuerda-1.jpg', 0, true);

-- Orders (12). Ana has 2, Pedro has none. Shipping: 8 EUR, VAT included
INSERT INTO orders (id, user_id, order_date, status, shipping_cost, currency) VALUES
  ('f0000000-0000-4000-8000-000000000001', 'a0000000-0000-4000-8000-000000000002', '2026-11-02 18:30:00+01', 'DELIVERED', 8, 'EUR'),
  ('f0000000-0000-4000-8000-000000000002', 'a0000000-0000-4000-8000-000000000002', '2026-11-15 11:05:00+01', 'PENDING', 8, 'EUR'),
  ('f0000000-0000-4000-8000-000000000003', 'a0000000-0000-4000-8000-000000000004', '2026-11-03 10:00:00+01', 'DELIVERED', 8, 'EUR'),
  ('f0000000-0000-4000-8000-000000000004', 'a0000000-0000-4000-8000-000000000004', '2026-11-12 20:15:00+01', 'SHIPPED', 8, 'EUR'),
  ('f0000000-0000-4000-8000-000000000005', 'a0000000-0000-4000-8000-000000000005', '2026-11-05 13:40:00+01', 'CANCELLED', 8, 'EUR'),
  ('f0000000-0000-4000-8000-000000000006', 'a0000000-0000-4000-8000-000000000006', '2026-11-06 09:20:00+01', 'DELIVERED', 8, 'EUR'),
  ('f0000000-0000-4000-8000-000000000007', 'a0000000-0000-4000-8000-000000000006', '2026-11-16 17:00:00+01', 'PENDING', 8, 'EUR'),
  ('f0000000-0000-4000-8000-000000000008', 'a0000000-0000-4000-8000-000000000007', '2026-11-08 12:00:00+01', 'SHIPPED', 8, 'EUR'),
  ('f0000000-0000-4000-8000-000000000009', 'a0000000-0000-4000-8000-000000000008', '2026-11-09 19:45:00+01', 'PENDING', 8, 'EUR'),
  ('f0000000-0000-4000-8000-000000000010', 'a0000000-0000-4000-8000-000000000009', '2026-11-10 08:30:00+01', 'DELIVERED', 8, 'EUR'),
  ('f0000000-0000-4000-8000-000000000011', 'a0000000-0000-4000-8000-000000000010', '2026-11-14 16:10:00+01', 'PENDING', 8, 'EUR'),
  ('f0000000-0000-4000-8000-000000000012', 'a0000000-0000-4000-8000-000000000012', '2026-11-17 21:00:00+01', 'SHIPPED', 8, 'EUR');

-- Shipping addresses: a copy for each order
INSERT INTO order_addresses (id, order_id, full_name, street, city, province, postal_code, country) VALUES
  ('f2000000-0000-4000-8000-000000000001', 'f0000000-0000-4000-8000-000000000001', 'Ana López', 'Plaza Mayor 2, 1º B', 'Valencia', 'Valencia', '46001', 'ES'),
  ('f2000000-0000-4000-8000-000000000002', 'f0000000-0000-4000-8000-000000000002', 'Ana López', 'Calle Sorní 21', 'Madrid', 'Madrid', '28001', 'ES'),
  ('f2000000-0000-4000-8000-000000000003', 'f0000000-0000-4000-8000-000000000003', 'Lucía Fernández', 'Gran Vía 30, 5º A', 'Alicante', 'Alicante', '03001', 'ES'),
  ('f2000000-0000-4000-8000-000000000004', 'f0000000-0000-4000-8000-000000000004', 'Lucía Fernández', 'Calle Russafa 9', 'Castellón de la Plana', 'Castellón', '12001', 'ES'),
  ('f2000000-0000-4000-8000-000000000005', 'f0000000-0000-4000-8000-000000000005', 'Javier Ruiz', 'Calle Colón 12, 3º', 'Sevilla', 'Sevilla', '41001', 'ES'),
  ('f2000000-0000-4000-8000-000000000006', 'f0000000-0000-4000-8000-000000000006', 'Marta Sánchez', 'Avenida del Puerto 45', 'Barcelona', 'Barcelona', '08001', 'ES'),
  ('f2000000-0000-4000-8000-000000000007', 'f0000000-0000-4000-8000-000000000007', 'Marta Sánchez', 'Calle de la Paz 7', 'Valencia', 'Valencia', '46001', 'ES'),
  ('f2000000-0000-4000-8000-000000000008', 'f0000000-0000-4000-8000-000000000008', 'Carlos Gómez', 'Plaza Mayor 2, 1º B', 'Madrid', 'Madrid', '28001', 'ES'),
  ('f2000000-0000-4000-8000-000000000009', 'f0000000-0000-4000-8000-000000000009', 'Elena Díaz', 'Calle Sorní 21', 'Alicante', 'Alicante', '03001', 'ES'),
  ('f2000000-0000-4000-8000-000000000010', 'f0000000-0000-4000-8000-000000000010', 'Pablo Moreno', 'Gran Vía 30, 5º A', 'Castellón de la Plana', 'Castellón', '12001', 'ES'),
  ('f2000000-0000-4000-8000-000000000011', 'f0000000-0000-4000-8000-000000000011', 'Sara Navarro', 'Calle Russafa 9', 'Sevilla', 'Sevilla', '41001', 'ES'),
  ('f2000000-0000-4000-8000-000000000012', 'f0000000-0000-4000-8000-000000000012', 'Laura Romero', 'Calle Colón 12, 3º', 'Barcelona', 'Barcelona', '08001', 'ES');

-- Order lines (name, SKU, price and VAT copied when ordering)
INSERT INTO order_lines (id, order_id, product_id, product_name, sku, quantity, unit_price, tax_rate, currency) VALUES
  ('f1000000-0000-4000-8000-000000000001', 'f0000000-0000-4000-8000-000000000001', 'd0000000-0000-4000-8000-000000000001', 'Silla Nora', 'FUR-SIL-001', 2, 100, 21, 'EUR'),
  ('f1000000-0000-4000-8000-000000000002', 'f0000000-0000-4000-8000-000000000001', 'd0000000-0000-4000-8000-000000000007', 'Mesa Nube', 'FUR-MES-007', 1, 120, 21, 'EUR'),
  ('f1000000-0000-4000-8000-000000000003', 'f0000000-0000-4000-8000-000000000002', 'd0000000-0000-4000-8000-000000000016', 'Lámpara Luna', 'FUR-LAM-016', 1, 89, 21, 'EUR'),
  ('f1000000-0000-4000-8000-000000000004', 'f0000000-0000-4000-8000-000000000002', 'd0000000-0000-4000-8000-000000000025', 'Cojín Coral', 'FUR-COJ-025', 4, 18, 21, 'EUR'),
  ('f1000000-0000-4000-8000-000000000005', 'f0000000-0000-4000-8000-000000000002', 'd0000000-0000-4000-8000-000000000015', 'Lámpara Syltherine', 'FUR-LAM-015', 1, 55, 21, 'EUR'),
  ('f1000000-0000-4000-8000-000000000006', 'f0000000-0000-4000-8000-000000000003', 'd0000000-0000-4000-8000-000000000006', 'Mesa Asgaard', 'FUR-MES-006', 1, 250, 21, 'EUR'),
  ('f1000000-0000-4000-8000-000000000007', 'f0000000-0000-4000-8000-000000000004', 'd0000000-0000-4000-8000-000000000020', 'Banco Kioto', 'FUR-BAN-020', 2, 70, 21, 'EUR'),
  ('f1000000-0000-4000-8000-000000000008', 'f0000000-0000-4000-8000-000000000004', 'd0000000-0000-4000-8000-000000000023', 'Espejo Sol', 'FUR-ESP-023', 1, 95, 21, 'EUR'),
  ('f1000000-0000-4000-8000-000000000009', 'f0000000-0000-4000-8000-000000000005', 'd0000000-0000-4000-8000-000000000011', 'Sofá Asgaard', 'FUR-SOF-011', 1, 890, 21, 'EUR'),
  ('f1000000-0000-4000-8000-000000000010', 'f0000000-0000-4000-8000-000000000006', 'd0000000-0000-4000-8000-000000000002', 'Silla Leviosa', 'FUR-SIL-002', 4, 65, 21, 'EUR'),
  ('f1000000-0000-4000-8000-000000000011', 'f0000000-0000-4000-8000-000000000006', 'd0000000-0000-4000-8000-000000000008', 'Mesa Pingky', 'FUR-MES-008', 1, 75, 21, 'EUR'),
  ('f1000000-0000-4000-8000-000000000012', 'f0000000-0000-4000-8000-000000000007', 'd0000000-0000-4000-8000-000000000019', 'Cama Ottawa', 'FUR-CAM-019', 1, 450, 21, 'EUR'),
  ('f1000000-0000-4000-8000-000000000013', 'f0000000-0000-4000-8000-000000000007', 'd0000000-0000-4000-8000-000000000021', 'Cómoda Oslo', 'FUR-COM-021', 1, 230, 21, 'EUR'),
  ('f1000000-0000-4000-8000-000000000014', 'f0000000-0000-4000-8000-000000000008', 'd0000000-0000-4000-8000-000000000017', 'Lámpara Faro', 'FUR-LAM-017', 1, 135, 21, 'EUR'),
  ('f1000000-0000-4000-8000-000000000015', 'f0000000-0000-4000-8000-000000000008', 'd0000000-0000-4000-8000-000000000024', 'Jarrón Brisa', 'FUR-JAR-024', 2, 25, 21, 'EUR'),
  ('f1000000-0000-4000-8000-000000000016', 'f0000000-0000-4000-8000-000000000009', 'd0000000-0000-4000-8000-000000000012', 'Sofá Kimbra', 'FUR-SOF-012', 1, 640, 21, 'EUR'),
  ('f1000000-0000-4000-8000-000000000017', 'f0000000-0000-4000-8000-000000000009', 'd0000000-0000-4000-8000-000000000026', 'Alfombra Sahara', 'FUR-ALF-026', 1, 120, 21, 'EUR'),
  ('f1000000-0000-4000-8000-000000000018', 'f0000000-0000-4000-8000-000000000009', 'd0000000-0000-4000-8000-000000000025', 'Cojín Coral', 'FUR-COJ-025', 2, 18, 21, 'EUR'),
  ('f1000000-0000-4000-8000-000000000019', 'f0000000-0000-4000-8000-000000000010', 'd0000000-0000-4000-8000-000000000010', 'Escritorio Bolt', 'FUR-ESC-010', 1, 160, 21, 'EUR'),
  ('f1000000-0000-4000-8000-000000000020', 'f0000000-0000-4000-8000-000000000010', 'd0000000-0000-4000-8000-000000000018', 'Flexo Duna', 'FUR-FLE-018', 1, 39, 21, 'EUR'),
  ('f1000000-0000-4000-8000-000000000021', 'f0000000-0000-4000-8000-000000000011', 'd0000000-0000-4000-8000-000000000004', 'Silla Respira', 'FUR-SIL-004', 2, 80, 21, 'EUR'),
  ('f1000000-0000-4000-8000-000000000022', 'f0000000-0000-4000-8000-000000000012', 'd0000000-0000-4000-8000-000000000028', 'Estantería Lira', 'FUR-EST-028', 1, 175, 21, 'EUR'),
  ('f1000000-0000-4000-8000-000000000023', 'f0000000-0000-4000-8000-000000000012', 'd0000000-0000-4000-8000-000000000023', 'Espejo Sol', 'FUR-ESP-023', 1, 95, 21, 'EUR'),
  ('f1000000-0000-4000-8000-000000000024', 'f0000000-0000-4000-8000-000000000012', 'd0000000-0000-4000-8000-000000000024', 'Jarrón Brisa', 'FUR-JAR-024', 3, 25, 21, 'EUR');
