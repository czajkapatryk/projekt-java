-- Migracja V2: Tworzenie tabeli projektów
-- Data: 2024-01-15
-- Opis: Tworzy tabelę projects z relacją do właściciela

CREATE TABLE IF NOT EXISTS projects (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    owner_id BIGINT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT fk_project_owner FOREIGN KEY (owner_id) 
        REFERENCES users(id) ON DELETE CASCADE
);

-- Indeksy
CREATE INDEX IF NOT EXISTS idx_projects_owner_id ON projects(owner_id);
CREATE INDEX IF NOT EXISTS idx_projects_name ON projects(name);

-- Komentarze
COMMENT ON TABLE projects IS 'Tabela przechowująca projekty';
COMMENT ON COLUMN projects.id IS 'Unikalny identyfikator projektu';
COMMENT ON COLUMN projects.name IS 'Nazwa projektu';
COMMENT ON COLUMN projects.description IS 'Opis projektu';
COMMENT ON COLUMN projects.owner_id IS 'ID właściciela projektu';
