-- Migracja V3.1: Naprawa typów kolumn w tabeli tasks
-- Data: 2024-01-15
-- Opis: Zmienia typy kolumn id, project_id, assignee_id z INTEGER na BIGINT

DO $$
DECLARE
    seq_name TEXT;
BEGIN
    -- Sprawdź czy kolumna id jest typu integer/serial
    IF EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'tasks' 
        AND column_name = 'id' 
        AND (data_type = 'integer' OR udt_name = 'int4')
    ) THEN
        -- Znajdź nazwę sekwencji dla kolumny id
        SELECT pg_get_serial_sequence('tasks', 'id') INTO seq_name;
        
        -- Jeśli istnieje sekwencja, zapisz jej aktualną wartość i usuń zależności
        IF seq_name IS NOT NULL THEN
            -- Pobierz aktualną wartość sekwencji przed zmianą (w EXECUTE używamy SELECT)
            EXECUTE format('SELECT setval(%L, (SELECT COALESCE(MAX(id), 1) FROM tasks))', seq_name);
        END IF;
        
        -- Usuń domyślną wartość z kolumny (aby móc usunąć sekwencję)
        ALTER TABLE tasks ALTER COLUMN id DROP DEFAULT;
        
        -- Usuń starą sekwencję jeśli istnieje
        IF seq_name IS NOT NULL THEN
            EXECUTE format('DROP SEQUENCE IF EXISTS %I CASCADE', seq_name);
        END IF;
        
        -- Zmień typ kolumny na BIGINT
        ALTER TABLE tasks ALTER COLUMN id TYPE BIGINT;
        
        -- Utwórz nową sekwencję BIGSERIAL
        CREATE SEQUENCE IF NOT EXISTS tasks_id_seq OWNED BY tasks.id;
        ALTER TABLE tasks ALTER COLUMN id SET DEFAULT nextval('tasks_id_seq');
        
        -- Ustaw aktualną wartość sekwencji
        PERFORM setval('tasks_id_seq', (SELECT COALESCE(MAX(id), 1) FROM tasks));
    END IF;
    
    -- Napraw project_id jeśli jest INTEGER
    IF EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'tasks' 
        AND column_name = 'project_id' 
        AND (data_type = 'integer' OR udt_name = 'int4')
    ) THEN
        -- Usuń foreign key constraint jeśli istnieje
        ALTER TABLE tasks DROP CONSTRAINT IF EXISTS fk_task_project;
        
        -- Zmień typ kolumny na BIGINT
        ALTER TABLE tasks ALTER COLUMN project_id TYPE BIGINT;
        
        -- Przywróć foreign key constraint
        ALTER TABLE tasks ADD CONSTRAINT fk_task_project 
            FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE;
    END IF;
    
    -- Napraw assignee_id jeśli jest INTEGER
    IF EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'tasks' 
        AND column_name = 'assignee_id' 
        AND (data_type = 'integer' OR udt_name = 'int4')
    ) THEN
        -- Usuń foreign key constraint jeśli istnieje
        ALTER TABLE tasks DROP CONSTRAINT IF EXISTS fk_task_assignee;
        
        -- Zmień typ kolumny na BIGINT
        ALTER TABLE tasks ALTER COLUMN assignee_id TYPE BIGINT;
        
        -- Przywróć foreign key constraint
        ALTER TABLE tasks ADD CONSTRAINT fk_task_assignee 
            FOREIGN KEY (assignee_id) REFERENCES users(id) ON DELETE SET NULL;
    END IF;
END $$;
