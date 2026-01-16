-- Migracja V2.2: Naprawa typu kolumny owner_id w tabeli projects
-- Data: 2024-01-15
-- Opis: Zmienia typ kolumny owner_id z INTEGER na BIGINT

DO $$
BEGIN
    -- Sprawdź czy kolumna owner_id jest typu integer
    IF EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'projects' 
        AND column_name = 'owner_id' 
        AND (data_type = 'integer' OR udt_name = 'int4')
    ) THEN
        -- Usuń foreign key constraint jeśli istnieje
        ALTER TABLE projects DROP CONSTRAINT IF EXISTS fk_project_owner;
        
        -- Zmień typ kolumny na BIGINT
        ALTER TABLE projects ALTER COLUMN owner_id TYPE BIGINT;
        
        -- Przywróć foreign key constraint
        ALTER TABLE projects ADD CONSTRAINT fk_project_owner 
            FOREIGN KEY (owner_id) REFERENCES users(id) ON DELETE CASCADE;
    END IF;
END $$;
