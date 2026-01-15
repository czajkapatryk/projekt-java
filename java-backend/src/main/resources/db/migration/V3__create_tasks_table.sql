-- Migracja V3: Tworzenie tabeli zadań
-- Data: 2024-01-15
-- Opis: Tworzy tabelę tasks z relacjami do projektu i użytkownika

CREATE TABLE IF NOT EXISTS tasks (
    id BIGSERIAL PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    status VARCHAR(20) NOT NULL DEFAULT 'TODO',
    priority VARCHAR(20) NOT NULL DEFAULT 'MEDIUM',
    due_date DATE,
    project_id BIGINT NOT NULL,
    assignee_id BIGINT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT fk_task_project FOREIGN KEY (project_id) 
        REFERENCES projects(id) ON DELETE CASCADE,
    CONSTRAINT fk_task_assignee FOREIGN KEY (assignee_id) 
        REFERENCES users(id) ON DELETE SET NULL,
    CONSTRAINT chk_task_status CHECK (status IN ('TODO', 'IN_PROGRESS', 'IN_REVIEW', 'DONE')),
    CONSTRAINT chk_task_priority CHECK (priority IN ('LOW', 'MEDIUM', 'HIGH', 'URGENT'))
);

-- Indeksy
CREATE INDEX idx_tasks_project_id ON tasks(project_id);
CREATE INDEX idx_tasks_assignee_id ON tasks(assignee_id);
CREATE INDEX idx_tasks_status ON tasks(status);
CREATE INDEX idx_tasks_priority ON tasks(priority);
CREATE INDEX idx_tasks_due_date ON tasks(due_date);

-- Komentarze
COMMENT ON TABLE tasks IS 'Tabela przechowująca zadania w projektach';
COMMENT ON COLUMN tasks.id IS 'Unikalny identyfikator zadania';
COMMENT ON COLUMN tasks.title IS 'Tytuł zadania';
COMMENT ON COLUMN tasks.description IS 'Szczegółowy opis zadania';
COMMENT ON COLUMN tasks.status IS 'Status zadania (TODO, IN_PROGRESS, IN_REVIEW, DONE)';
COMMENT ON COLUMN tasks.priority IS 'Priorytet zadania (LOW, MEDIUM, HIGH, URGENT)';
COMMENT ON COLUMN tasks.due_date IS 'Termin wykonania zadania';
COMMENT ON COLUMN tasks.project_id IS 'ID projektu, do którego należy zadanie';
COMMENT ON COLUMN tasks.assignee_id IS 'ID użytkownika przypisanego do zadania';
