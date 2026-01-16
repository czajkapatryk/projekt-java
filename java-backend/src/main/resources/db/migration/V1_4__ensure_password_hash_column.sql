-- Migracja V1.4: Upewnienie się, że kolumna password_hash istnieje
-- Data: 2024-01-16
-- Opis: Zapewnia, że kolumna password_hash istnieje (nie zmienia jeśli już istnieje)

DO $$
BEGIN
    -- Jeśli istnieje password (bez _hash), zmień na password_hash
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='users' AND column_name='password') 
       AND NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='users' AND column_name='password_hash') THEN
        -- Tylko password istnieje - zmień nazwę na password_hash
        ALTER TABLE users RENAME COLUMN password TO password_hash;
    END IF;
    
    -- Jeśli oba istnieją, usuń password (zostawiamy password_hash)
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='users' AND column_name='password') 
       AND EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='users' AND column_name='password_hash') THEN
        -- Oba istnieją - usuń password (używamy password_hash)
        ALTER TABLE users DROP COLUMN password;
    END IF;
    
    -- Dodaj kolumnę password_hash jeśli nie istnieje w ogóle
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='users' AND column_name='password_hash') 
       AND NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='users' AND column_name='password') THEN
        ALTER TABLE users ADD COLUMN password_hash VARCHAR(255);
        -- Ustaw domyślną wartość dla istniejących rekordów
        UPDATE users SET password_hash = '$2a$10$N9qo8uLOickgx2ZMRZoMy.Mrq4H9f1D2B6slHxU6Z1D6q1JZl1Gxe' WHERE password_hash IS NULL;
        -- Teraz ustaw NOT NULL
        ALTER TABLE users ALTER COLUMN password_hash SET NOT NULL;
    END IF;
END $$;
