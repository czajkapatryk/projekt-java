-- Skrypt do utworzenia bazy danych TaskFlow
-- Uruchom jako superuser PostgreSQL

-- Usuń bazę jeśli istnieje (UWAGA: usunie wszystkie dane!)
-- DROP DATABASE IF EXISTS taskflow;

-- Utwórz bazę danych
CREATE DATABASE taskflow
    WITH 
    OWNER = postgres
    ENCODING = 'UTF8'
    LC_COLLATE = 'pl_PL.UTF-8'
    LC_CTYPE = 'pl_PL.UTF-8'
    TEMPLATE = template0;

-- Utwórz użytkownika aplikacji
CREATE USER taskflow_user WITH PASSWORD 'taskflow_password';

-- Nadaj uprawnienia
GRANT ALL PRIVILEGES ON DATABASE taskflow TO taskflow_user;

-- Połącz się z bazą taskflow
\c taskflow

-- Nadaj uprawnienia do schematu public
GRANT ALL ON SCHEMA public TO taskflow_user;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO taskflow_user;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO taskflow_user;

-- Ustaw domyślne uprawnienia dla przyszłych obiektów
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO taskflow_user;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO taskflow_user;

COMMENT ON DATABASE taskflow IS 'Baza danych systemu zarządzania zadaniami TaskFlow';
