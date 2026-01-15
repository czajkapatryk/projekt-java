-- Dodanie przykładowych użytkowników
-- Hasło: password123 (zahashowane przez bcrypt)
INSERT INTO users (email, password_hash, first_name, last_name, role) VALUES
('jan.kowalski@example.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZRGdjGj/n3.QbV3/n3.C3S3OyqRmK', 'Jan', 'Kowalski', 'ADMIN'),
('anna.nowak@example.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZRGdjGj/n3.QbV3/n3.C3S3OyqRmK', 'Anna', 'Nowak', 'USER'),
('piotr.wisniewski@example.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZRGdjGj/n3.QbV3/n3.C3S3OyqRmK', 'Piotr', 'Wiśniewski', 'USER')
ON CONFLICT (email) DO NOTHING;

-- Dodanie przykładowych projektów
INSERT INTO projects (name, description, owner_id) VALUES
('Aplikacja mobilna', 'Rozwój aplikacji mobilnej dla klientów', 1),
('Strona firmowa', 'Redesign strony internetowej firmy', 1),
('System CRM', 'Wdrożenie nowego systemu CRM', 2)
ON CONFLICT DO NOTHING;

-- Dodanie członków projektów
INSERT INTO project_members (project_id, user_id, role) VALUES
(1, 1, 'OWNER'),
(1, 2, 'MEMBER'),
(2, 1, 'OWNER'),
(2, 3, 'MEMBER'),
(3, 2, 'OWNER'),
(3, 1, 'MEMBER')
ON CONFLICT DO NOTHING;

-- Dodanie przykładowych zadań
INSERT INTO tasks (title, description, status, priority, project_id, assignee_id, due_date) VALUES
-- Projekt 1: Aplikacja mobilna
('Projekt UI/UX', 'Zaprojektować interfejs użytkownika', 'DONE', 'HIGH', 1, 2, CURRENT_DATE - INTERVAL '5 days'),
('Implementacja logowania', 'Dodać funkcję logowania przez OAuth', 'IN_PROGRESS', 'HIGH', 1, 1, CURRENT_DATE + INTERVAL '3 days'),
('Testy jednostkowe', 'Napisać testy dla modułu autoryzacji', 'TODO', 'MEDIUM', 1, 2, CURRENT_DATE + INTERVAL '7 days'),
('Integracja z API', 'Połączyć aplikację z backendem', 'TODO', 'HIGH', 1, 1, CURRENT_DATE + INTERVAL '10 days'),

-- Projekt 2: Strona firmowa
('Analiza konkurencji', 'Przeanalizować strony konkurentów', 'DONE', 'MEDIUM', 2, 3, CURRENT_DATE - INTERVAL '10 days'),
('Wireframes', 'Stworzyć wireframes dla głównych podstron', 'DONE', 'HIGH', 2, 1, CURRENT_DATE - INTERVAL '3 days'),
('Implementacja RWD', 'Dostosować stronę do urządzeń mobilnych', 'IN_PROGRESS', 'HIGH', 2, 3, CURRENT_DATE + INTERVAL '5 days'),
('Optymalizacja SEO', 'Zoptymalizować stronę pod SEO', 'TODO', 'LOW', 2, 1, CURRENT_DATE + INTERVAL '14 days'),

-- Projekt 3: System CRM
('Analiza wymagań', 'Zebrać wymagania od stakeholderów', 'DONE', 'HIGH', 3, 2, CURRENT_DATE - INTERVAL '7 days'),
('Wybór dostawcy', 'Porównać dostępne rozwiązania CRM', 'IN_PROGRESS', 'HIGH', 3, 1, CURRENT_DATE + INTERVAL '2 days'),
('Migracja danych', 'Przygotować plan migracji danych', 'TODO', 'MEDIUM', 3, 2, CURRENT_DATE + INTERVAL '20 days'),
('Szkolenie zespołu', 'Przeprowadzić szkolenie z nowego systemu', 'TODO', 'LOW', 3, 1, CURRENT_DATE + INTERVAL '30 days')
ON CONFLICT DO NOTHING;
