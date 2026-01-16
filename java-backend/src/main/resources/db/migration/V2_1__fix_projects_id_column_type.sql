-- Migracja V2.1: Naprawa typu kolumny id w tabeli projects
-- Data: 2024-01-15
-- Opis: Zmienia typ kolumny id z serial (INTEGER) na BIGINT

DO $$
DECLARE
    seq_name TEXT;
    new_seq_name TEXT;
BEGIN
    -- Sprawdź czy kolumna id jest typu integer/serial
    IF EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'projects' 
        AND column_name = 'id' 
        AND (data_type = 'integer' OR udt_name = 'int4')
    ) THEN
        -- Znajdź nazwę sekwencji dla kolumny id
        SELECT pg_get_serial_sequence('projects', 'id') INTO seq_name;
        
        -- Jeśli istnieje sekwencja, usuń ją (będzie utworzona ponownie)
        IF seq_name IS NOT NULL THEN
            -- Pobierz aktualną wartość sekwencji
            EXECUTE format('SELECT setval(%L, (SELECT COALESCE(MAX(id), 1) FROM projects))', seq_name);
            DROP SEQUENCE IF EXISTS projects_id_seq;
        END IF;
        
        -- Zmień typ kolumny na BIGINT
        ALTER TABLE projects ALTER COLUMN id TYPE BIGINT;
        
        -- Utwórz nową sekwencję BIGSERIAL
        CREATE SEQUENCE IF NOT EXISTS projects_id_seq OWNED BY projects.id;
        ALTER TABLE projects ALTER COLUMN id SET DEFAULT nextval('projects_id_seq');
        
        -- Ustaw aktualną wartość sekwencji
        SELECT setval('projects_id_seq', (SELECT COALESCE(MAX(id), 1) FROM projects));
    END IF;
END $$;
