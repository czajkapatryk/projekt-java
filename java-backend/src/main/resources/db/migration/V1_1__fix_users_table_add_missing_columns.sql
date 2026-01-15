-- Migracja naprawcza V1.1: Dodanie brakujących kolumn do tabeli users
-- Data: 2024-01-15
-- Opis: Naprawia istniejącą tabelę users dodając brakujące kolumny (password, first_name, etc.)

DO $$
BEGIN
    -- Dodaj kolumnę password jeśli nie istnieje
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='users' AND column_name='password') THEN
        ALTER TABLE users ADD COLUMN password VARCHAR(255);
        -- Ustaw domyślną wartość dla istniejących rekordów
        UPDATE users SET password = '$2a$10$N9qo8uLOickgx2ZMRZoMy.Mrq4H9f1D2B6slHxU6Z1D6q1JZl1Gxe' WHERE password IS NULL;
        -- Teraz ustaw NOT NULL
        ALTER TABLE users ALTER COLUMN password SET NOT NULL;
    END IF;
    
    -- Dodaj kolumnę first_name jeśli nie istnieje
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='users' AND column_name='first_name') THEN
        ALTER TABLE users ADD COLUMN first_name VARCHAR(100);
        UPDATE users SET first_name = 'User' WHERE first_name IS NULL;
        ALTER TABLE users ALTER COLUMN first_name SET NOT NULL;
    END IF;
    
    -- Dodaj kolumnę last_name jeśli nie istnieje
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='users' AND column_name='last_name') THEN
        ALTER TABLE users ADD COLUMN last_name VARCHAR(100);
        UPDATE users SET last_name = 'Name' WHERE last_name IS NULL;
        ALTER TABLE users ALTER COLUMN last_name SET NOT NULL;
    END IF;
    
    -- Dodaj kolumnę role jeśli nie istnieje
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='users' AND column_name='role') THEN
        ALTER TABLE users ADD COLUMN role VARCHAR(20) NOT NULL DEFAULT 'USER';
    END IF;
    
    -- Dodaj kolumnę created_at jeśli nie istnieje
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='users' AND column_name='created_at') THEN
        ALTER TABLE users ADD COLUMN created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP;
    END IF;
    
    -- Dodaj kolumnę updated_at jeśli nie istnieje
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='users' AND column_name='updated_at') THEN
        ALTER TABLE users ADD COLUMN updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;
    END IF;
END $$;
