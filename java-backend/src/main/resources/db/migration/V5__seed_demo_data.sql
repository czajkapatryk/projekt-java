-- Migracja V5: Dane demonstracyjne
-- Data: 2024-01-15
-- Opis: Wprowadza przykładowe dane do celów testowych

-- Hasło: Test123! (zahashowane BCrypt)
INSERT INTO users (email, password, first_name, last_name, role) VALUES
('admin@taskflow.pl', '$2a$10$N9qo8uLOickgx2ZMRZoMy.Mrq4H9f1D2B6slHxU6Z1D6q1JZl1Gxe', 'Admin', 'Systemowy', 'ADMIN'),
('jan.kowalski@example.com', '$2a$10$N9qo8uLOickgx2ZMRZoMy.Mrq4H9f1D2B6slHxU6Z1D6q1JZl1Gxe', 'Jan', 'Kowalski', 'USER'),
('anna.nowak@example.com', '$2a$10$N9qo8uLOickgx2ZMRZoMy.Mrq4H9f1D2B6slHxU6Z1D6q1JZl1Gxe', 'Anna', 'Nowak', 'USER'),
('piotr.wisniewski@example.com', '$2a$10$N9qo8uLOickgx2ZMRZoMy.Mrq4H9f1D2B6slHxU6Z1D6q1JZl1Gxe', 'Piotr', 'Wiśniewski', 'USER');

-- Projekty demonstracyjne
INSERT INTO projects (name, description, owner_id) VALUES
('Website Redesign', 'Przeprojektowanie strony firmowej z nowym designem i ulepszoną nawigacją', 2),
('Mobile App', 'Rozwój aplikacji mobilnej dla klientów na iOS i Android', 2),
('API Integration', 'Integracja z zewnętrznymi API partnerów biznesowych', 3);

-- Członkowie projektów
INSERT INTO project_members (project_id, user_id, role) VALUES
(1, 2, 'OWNER'),
(1, 3, 'MEMBER'),
(1, 4, 'MEMBER'),
(2, 2, 'OWNER'),
(2, 4, 'ADMIN'),
(3, 3, 'OWNER'),
(3, 2, 'MEMBER');

-- Zadania demonstracyjne
INSERT INTO tasks (title, description, status, priority, due_date, project_id, assignee_id) VALUES
-- Projekt 1: Website Redesign
('Analiza wymagań', 'Zebranie wymagań od interesariuszy i stworzenie dokumentacji', 'DONE', 'HIGH', '2024-01-10', 1, 2),
('Projekt UI/UX', 'Stworzenie makiet i prototypów w Figma', 'DONE', 'HIGH', '2024-01-15', 1, 3),
('Implementacja frontendu', 'Kodowanie stron w React/Next.js zgodnie z makietami', 'IN_PROGRESS', 'HIGH', '2024-01-25', 1, 4),
('Testy responsywności', 'Testowanie na różnych urządzeniach i przeglądarkach', 'TODO', 'MEDIUM', '2024-01-30', 1, 3),
('Optymalizacja SEO', 'Implementacja meta tagów i structured data', 'TODO', 'LOW', '2024-02-05', 1, NULL),

-- Projekt 2: Mobile App
('Setup projektu', 'Konfiguracja React Native z TypeScript', 'DONE', 'URGENT', '2024-01-08', 2, 4),
('Ekran logowania', 'Implementacja UI i logiki logowania', 'IN_PROGRESS', 'HIGH', '2024-01-20', 2, 4),
('Lista produktów', 'Wyświetlanie produktów z paginacją', 'TODO', 'MEDIUM', '2024-01-28', 2, 2),
('Koszyk zakupowy', 'Funkcjonalność dodawania do koszyka', 'TODO', 'HIGH', '2024-02-10', 2, NULL),

-- Projekt 3: API Integration
('Dokumentacja API', 'Analiza dokumentacji API partnerów', 'DONE', 'HIGH', '2024-01-12', 3, 3),
('Implementacja klienta HTTP', 'Stworzenie warstwy komunikacji z API', 'IN_REVIEW', 'HIGH', '2024-01-18', 3, 2),
('Mapowanie danych', 'Transformacja danych między formatami', 'IN_PROGRESS', 'MEDIUM', '2024-01-22', 3, 3),
('Obsługa błędów', 'Implementacja retry logic i error handling', 'TODO', 'MEDIUM', '2024-01-28', 3, 2);
