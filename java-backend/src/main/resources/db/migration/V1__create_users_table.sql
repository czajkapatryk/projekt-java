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

-- Dodaj brakujące kolumny jeśli tabela już istnieje (dla kompatybilności z istniejącymi bazami)
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='users' AND column_name='password') THEN
        ALTER TABLE users ADD COLUMN password VARCHAR(255) NOT NULL DEFAULT '';
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='users' AND column_name='first_name') THEN
        ALTER TABLE users ADD COLUMN first_name VARCHAR(100) NOT NULL DEFAULT '';
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='users' AND column_name='last_name') THEN
        ALTER TABLE users ADD COLUMN last_name VARCHAR(100) NOT NULL DEFAULT '';
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='users' AND column_name='role') THEN
        ALTER TABLE users ADD COLUMN role VARCHAR(20) NOT NULL DEFAULT 'USER';
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='users' AND column_name='created_at') THEN
        ALTER TABLE users ADD COLUMN created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='users' AND column_name='updated_at') THEN
        ALTER TABLE users ADD COLUMN updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;
    END IF;
END $$;

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
