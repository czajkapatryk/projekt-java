-- Migracja V1: Tworzenie tabeli użytkowników
-- Data: 2024-01-15
-- Opis: Tworzy tabelę users z podstawowymi polami użytkownika

CREATE TABLE IF NOT EXISTS users (
    id BIGSERIAL PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    role VARCHAR(20) NOT NULL DEFAULT 'USER',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT chk_user_role CHECK (role IN ('USER', 'ADMIN'))
);

-- Indeks na email dla szybszego wyszukiwania
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- Komentarze do tabeli i kolumn
COMMENT ON TABLE users IS 'Tabela przechowująca dane użytkowników systemu';
COMMENT ON COLUMN users.id IS 'Unikalny identyfikator użytkownika';
COMMENT ON COLUMN users.email IS 'Adres email użytkownika (unikalny)';
COMMENT ON COLUMN users.password IS 'Zahashowane hasło użytkownika (BCrypt)';
COMMENT ON COLUMN users.first_name IS 'Imię użytkownika';
COMMENT ON COLUMN users.last_name IS 'Nazwisko użytkownika';
COMMENT ON COLUMN users.role IS 'Rola użytkownika w systemie (USER, ADMIN)';
COMMENT ON COLUMN users.created_at IS 'Data utworzenia konta';
COMMENT ON COLUMN users.updated_at IS 'Data ostatniej aktualizacji';
