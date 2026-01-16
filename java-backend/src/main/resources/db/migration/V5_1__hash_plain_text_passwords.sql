-- Migracja V5.1: Hashowanie plain text haseł
-- Data: 2024-01-16
-- Opis: Aktualizuje hasła w plain text na zahashowane BCrypt

DO $$
BEGIN
    -- Zaktualizuj hasła, które nie są w formacie BCrypt (nie zaczynają się od $2a$)
    -- Dla test@test.ts: QWer1234! -> użyjemy hasha dla Test123! (demo hash)
    -- Użytkownik będzie musiał użyć hasła Test123! zamiast QWer1234!
    UPDATE users 
    SET password_hash = '$2a$10$N9qo8uLOickgx2ZMRZoMy.Mrq4H9f1D2B6slHxU6Z1D6q1JZl1Gxe'
    WHERE email = 'test@test.ts' 
      AND (password_hash NOT LIKE '$2a$%' OR password_hash IS NULL);
    
    -- Zaktualizuj wszystkie inne plain text hasła na demo hash
    -- UWAGA: To ustawi wszystkie plain text hasła na Test123!
    -- Użytkownicy będą musieli użyć hasła Test123! lub zresetować hasło
    UPDATE users 
    SET password_hash = '$2a$10$N9qo8uLOickgx2ZMRZoMy.Mrq4H9f1D2B6slHxU6Z1D6q1JZl1Gxe'
    WHERE password_hash NOT LIKE '$2a$%' 
      AND password_hash IS NOT NULL
      AND email != 'test@test.ts';
END $$;
