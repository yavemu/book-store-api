-- Activa extensión para UUID
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================
-- Géneros de Libros
-- ============================
INSERT INTO book_genres (id, name, description, created_at)
VALUES
(uuid_generate_v4(), 'Ficción', 'Historias ficticias', NOW()),
(uuid_generate_v4(), 'No Ficción', 'Basados en hechos reales', NOW()),
(uuid_generate_v4(), 'Ciencia', 'Libros de ciencia', NOW()),
(uuid_generate_v4(), 'Historia', 'Libros históricos', NOW()),
(uuid_generate_v4(), 'Fantasía', 'Historias fantásticas', NOW()),
(uuid_generate_v4(), 'Biografía', 'Vida de personas', NOW()),
(uuid_generate_v4(), 'Tecnología', 'Avances tecnológicos', NOW()),
(uuid_generate_v4(), 'Romance', 'Historias románticas', NOW()),
(uuid_generate_v4(), 'Aventura', 'Libros de aventuras', NOW()),
(uuid_generate_v4(), 'Misterio', 'Libros de misterio', NOW()),
(uuid_generate_v4(), 'Educación', 'Textos educativos', NOW()),
(uuid_generate_v4(), 'Arte', 'Obras y teoría del arte', NOW()),
(uuid_generate_v4(), 'Infantil', 'Cuentos para niños', NOW()),
(uuid_generate_v4(), 'Poesía', 'Colección de poemas', NOW()),
(uuid_generate_v4(), 'Autoayuda', 'Crecimiento personal', NOW());

-- ============================
-- Autores
-- ============================
INSERT INTO book_authors (id, first_name, last_name, nationality, birth_date, biography, created_at)
VALUES
(uuid_generate_v4(), 'Juan', 'Pérez', 'Colombiana', '1975-05-12', 'Autor colombiano de ficción.', NOW()),
(uuid_generate_v4(), 'María', 'Gómez', 'Mexicana', '1980-08-22', 'Escritora de novelas románticas.', NOW()),
(uuid_generate_v4(), 'Luis', 'Martínez', 'Argentina', '1965-03-15', 'Experto en historia.', NOW()),
(uuid_generate_v4(), 'Ana', 'López', 'Española', '1990-07-09', 'Poeta contemporánea.', NOW()),
(uuid_generate_v4(), 'Pedro', 'Ramírez', 'Chilena', '1988-11-30', 'Escritor de ciencia ficción.', NOW()),
(uuid_generate_v4(), 'Laura', 'Torres', 'Peruana', '1972-06-14', 'Autora infantil.', NOW()),
(uuid_generate_v4(), 'Carlos', 'Fernández', 'Uruguaya', '1977-02-03', 'Ensayista y periodista.', NOW()),
(uuid_generate_v4(), 'Elena', 'Díaz', 'Colombiana', '1985-04-25', 'Especialista en biografías.', NOW()),
(uuid_generate_v4(), 'Andrés', 'Castro', 'Venezolana', '1992-01-17', 'Novelista joven.', NOW()),
(uuid_generate_v4(), 'Sofía', 'Rojas', 'Ecuatoriana', '1995-09-12', 'Autora de fantasía.', NOW()),
(uuid_generate_v4(), 'Diego', 'Herrera', 'Colombiana', '1971-12-05', 'Escritor de educación.', NOW()),
(uuid_generate_v4(), 'Valentina', 'Mendoza', 'Boliviana', '1982-07-07', 'Poeta.', NOW()),
(uuid_generate_v4(), 'Miguel', 'Vega', 'Española', '1960-10-18', 'Historiador.', NOW()),
(uuid_generate_v4(), 'Camila', 'Morales', 'Chilena', '1987-02-28', 'Autora de misterio.', NOW()),
(uuid_generate_v4(), 'Jorge', 'Navarro', 'Argentina', '1993-11-11', 'Novelista emergente.', NOW());

-- ============================
-- Editoriales
-- ============================
INSERT INTO publishing_houses (id, name, country, website_url, created_at)
VALUES
(uuid_generate_v4(), 'Planeta', 'España', 'https://www.planetadelibros.com', NOW()),
(uuid_generate_v4(), 'Alfaguara', 'México', 'https://www.alfaguara.com', NOW()),
(uuid_generate_v4(), 'Norma', 'Colombia', 'https://www.norma.com', NOW()),
(uuid_generate_v4(), 'Santillana', 'Argentina', 'https://www.santillana.com', NOW()),
(uuid_generate_v4(), 'Siglo XXI', 'México', 'https://www.sigloxxieditores.com', NOW()),
(uuid_generate_v4(), 'Anagrama', 'España', 'https://www.anagrama-ed.es', NOW()),
(uuid_generate_v4(), 'SM', 'España', 'https://www.grupo-sm.com', NOW()),
(uuid_generate_v4(), 'Random House', 'EEUU', 'https://www.penguinrandomhouse.com', NOW()),
(uuid_generate_v4(), 'Oceano', 'México', 'https://www.oceano.com', NOW()),
(uuid_generate_v4(), 'Debolsillo', 'España', 'https://www.debolsillo.com', NOW()),
(uuid_generate_v4(), 'Ariel', 'España', 'https://www.ariel.com', NOW()),
(uuid_generate_v4(), 'Paidós', 'Argentina', 'https://www.paidos.com', NOW()),
(uuid_generate_v4(), 'Universidad Nacional', 'Colombia', 'https://unal.edu.co', NOW()),
(uuid_generate_v4(), 'Taurus', 'México', 'https://www.taurus.com', NOW()),
(uuid_generate_v4(), 'McGraw Hill', 'EEUU', 'https://www.mheducation.com', NOW());

-- ============================
-- Catálogo de Libros
-- ============================
-- Usamos subconsultas para asignar género y editorial aleatorios
INSERT INTO book_catalog (id, title, isbn_code, price, is_available, stock_quantity, cover_image_url, publication_date, page_count, summary, genre_id, publisher_id, created_at)
VALUES
(uuid_generate_v4(), 'El viaje de la vida', '9780000000011', 19.99, TRUE, 50, 'https://picsum.photos/200?1', '2015-01-10', 320, 'Una historia inspiradora.', (SELECT id FROM book_genres ORDER BY random() LIMIT 1), (SELECT id FROM publishing_houses ORDER BY random() LIMIT 1), NOW()),
(uuid_generate_v4(), 'La ciencia del futuro', '9780000000022', 25.50, TRUE, 30, 'https://picsum.photos/200?2', '2018-05-22', 280, 'Libro sobre avances científicos.', (SELECT id FROM book_genres ORDER BY random() LIMIT 1), (SELECT id FROM publishing_houses ORDER BY random() LIMIT 1), NOW()),
(uuid_generate_v4(), 'Historias perdidas', '9780000000033', 15.75, TRUE, 40, 'https://picsum.photos/200?3', '2020-11-11', 200, 'Relatos históricos.', (SELECT id FROM book_genres ORDER BY random() LIMIT 1), (SELECT id FROM publishing_houses ORDER BY random() LIMIT 1), NOW()),
(uuid_generate_v4(), 'Amor eterno', '9780000000044', 18.20, TRUE, 60, 'https://picsum.photos/200?4', '2019-02-14', 250, 'Novela romántica.', (SELECT id FROM book_genres ORDER BY random() LIMIT 1), (SELECT id FROM publishing_houses ORDER BY random() LIMIT 1), NOW()),
(uuid_generate_v4(), 'El misterio de la cueva', '9780000000055', 22.10, TRUE, 35, 'https://picsum.photos/200?5', '2016-09-05', 300, 'Misterio en un pueblo pequeño.', (SELECT id FROM book_genres ORDER BY random() LIMIT 1), (SELECT id FROM publishing_houses ORDER BY random() LIMIT 1), NOW()),
(uuid_generate_v4(), 'Fantasía en el bosque', '9780000000066', 21.40, TRUE, 45, 'https://picsum.photos/200?6', '2021-03-03', 280, 'Aventura fantástica.', (SELECT id FROM book_genres ORDER BY random() LIMIT 1), (SELECT id FROM publishing_houses ORDER BY random() LIMIT 1), NOW()),
(uuid_generate_v4(), 'La mente creativa', '9780000000077', 30.00, TRUE, 20, 'https://picsum.photos/200?7', '2017-07-20', 350, 'Ensayo sobre creatividad.', (SELECT id FROM book_genres ORDER BY random() LIMIT 1), (SELECT id FROM publishing_houses ORDER BY random() LIMIT 1), NOW()),
(uuid_generate_v4(), 'Biografía de un soñador', '9780000000088', 24.90, TRUE, 25, 'https://picsum.photos/200?8', '2014-04-04', 270, 'Vida de un autor famoso.', (SELECT id FROM book_genres ORDER BY random() LIMIT 1), (SELECT id FROM publishing_houses ORDER BY random() LIMIT 1), NOW()),
(uuid_generate_v4(), 'Arte y cultura', '9780000000099', 28.00, TRUE, 15, 'https://picsum.photos/200?9', '2013-12-01', 310, 'Exploración del arte moderno.', (SELECT id FROM book_genres ORDER BY random() LIMIT 1), (SELECT id FROM publishing_houses ORDER BY random() LIMIT 1), NOW()),
(uuid_generate_v4(), 'Educación para todos', '9780000000100', 20.00, TRUE, 55, 'https://picsum.photos/200?10', '2022-01-01', 290, 'Manual educativo.', (SELECT id FROM book_genres ORDER BY random() LIMIT 1), (SELECT id FROM publishing_houses ORDER BY random() LIMIT 1), NOW()),
(uuid_generate_v4(), 'El poder de la mente', '9780000000111', 23.75, TRUE, 33, 'https://picsum.photos/200?11', '2016-08-19', 240, 'Libro de autoayuda.', (SELECT id FROM book_genres ORDER BY random() LIMIT 1), (SELECT id FROM publishing_houses ORDER BY random() LIMIT 1), NOW()),
(uuid_generate_v4(), 'Poemas del alma', '9780000000122', 14.90, TRUE, 38, 'https://picsum.photos/200?12', '2019-09-21', 180, 'Colección de poesía.', (SELECT id FROM book_genres ORDER BY random() LIMIT 1), (SELECT id FROM publishing_houses ORDER BY random() LIMIT 1), NOW()),
(uuid_generate_v4(), 'Cuentos mágicos', '9780000000133', 16.80, TRUE, 42, 'https://picsum.photos/200?13', '2018-06-06', 210, 'Relatos infantiles.', (SELECT id FROM book_genres ORDER BY random() LIMIT 1), (SELECT id FROM publishing_houses ORDER BY random() LIMIT 1), NOW()),
(uuid_generate_v4(), 'Historia universal', '9780000000144', 27.60, TRUE, 28, 'https://picsum.photos/200?14', '2012-10-30', 400, 'Libro histórico.', (SELECT id FROM book_genres ORDER BY random() LIMIT 1), (SELECT id FROM publishing_houses ORDER BY random() LIMIT 1), NOW()),
(uuid_generate_v4(), 'Tecnología y futuro', '9780000000155', 26.50, TRUE, 22, 'https://picsum.photos/200?15', '2021-12-25', 330, 'Innovaciones tecnológicas.', (SELECT id FROM book_genres ORDER BY random() LIMIT 1), (SELECT id FROM publishing_houses ORDER BY random() LIMIT 1), NOW());

-- ============================
-- Asignaciones Autor - Libro
-- ============================
INSERT INTO book_author_assignments (id, book_id, author_id, created_at)
SELECT uuid_generate_v4(), b.id, a.id, NOW()
FROM (SELECT id FROM book_catalog LIMIT 15) b
JOIN (SELECT id FROM book_authors ORDER BY random() LIMIT 15) a
ON true;
