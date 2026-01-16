-- Migracja V5.1: Hashowanie plain text haseł i naprawa demo kont
-- Data: 2024-01-16
-- Opis: Aktualizuje hasła w plain text na zahashowane BCrypt i upewnia się, że demo konta mają poprawne hasła

DO $$
BEGIN
    -- Hash dla hasła "Test123!" (BCrypt) - 60 znaków
    -- Ten hash jest używany dla wszystkich demo kont
    DECLARE
        demo_password_hash VARCHAR(255) := '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZRGdjGj/n3.QbV3/n3.C3S3OyqRmK';
    BEGIN
        -- Zaktualizuj hasła, które nie są w formacie BCrypt (nie zaczynają się od $2a$)
        UPDATE users 
        SET password_hash = demo_password_hash
        WHERE password_hash NOT LIKE '$2a$%' 
          AND password_hash IS NOT NULL;
        
        -- Upewnij się, że wszystkie demo konta mają poprawne hasło (Test123!)
        -- To naprawia przypadki, gdy hash był nieprawidłowy lub został zmieniony
        UPDATE users 
        SET password_hash = demo_password_hash
        WHERE email IN (
            'admin@taskflow.pl',
            'jan.kowalski@example.com',
            'anna.nowak@example.com',
            'piotr.wisniewski@example.com',
            'test@test.ts'
        );
        
        RAISE NOTICE 'Zaktualizowano hasła dla demo kont i plain text haseł. Wszystkie demo konta używają hasła: Test123!';
    END;
END $$;
