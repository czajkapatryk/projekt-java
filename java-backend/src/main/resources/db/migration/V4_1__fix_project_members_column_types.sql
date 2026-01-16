-- Migracja V4.1: Naprawa typów kolumn w tabeli project_members
-- Data: 2024-01-15
-- Opis: Zmienia typ kolumn project_id i user_id z INTEGER na BIGINT

DO $$
BEGIN
    -- Zmień typ project_id jeśli jest INTEGER
    IF EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'project_members' 
        AND column_name = 'project_id' 
        AND data_type = 'integer'
    ) THEN
        ALTER TABLE project_members ALTER COLUMN project_id TYPE BIGINT;
    END IF;
    
    -- Zmień typ user_id jeśli jest INTEGER
    IF EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'project_members' 
        AND column_name = 'user_id' 
        AND data_type = 'integer'
    ) THEN
        ALTER TABLE project_members ALTER COLUMN user_id TYPE BIGINT;
    END IF;
END $$;
