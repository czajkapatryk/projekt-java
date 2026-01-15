-- Migracja V4: Tworzenie tabeli członków projektu
-- Data: 2024-01-15
-- Opis: Tworzy tabelę project_members dla relacji N:M między użytkownikami a projektami

CREATE TABLE IF NOT EXISTS project_members (
    project_id BIGINT NOT NULL,
    user_id BIGINT NOT NULL,
    role VARCHAR(20) NOT NULL DEFAULT 'MEMBER',
    joined_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    
    PRIMARY KEY (project_id, user_id),
    CONSTRAINT fk_pm_project FOREIGN KEY (project_id) 
        REFERENCES projects(id) ON DELETE CASCADE,
    CONSTRAINT fk_pm_user FOREIGN KEY (user_id) 
        REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT chk_pm_role CHECK (role IN ('OWNER', 'ADMIN', 'MEMBER', 'VIEWER'))
);

-- Indeksy
CREATE INDEX idx_project_members_user_id ON project_members(user_id);

-- Komentarze
COMMENT ON TABLE project_members IS 'Tabela łącząca użytkowników z projektami (relacja N:M)';
COMMENT ON COLUMN project_members.project_id IS 'ID projektu';
COMMENT ON COLUMN project_members.user_id IS 'ID użytkownika będącego członkiem projektu';
COMMENT ON COLUMN project_members.role IS 'Rola użytkownika w projekcie (OWNER, ADMIN, MEMBER, VIEWER)';
COMMENT ON COLUMN project_members.joined_at IS 'Data dołączenia do projektu';
