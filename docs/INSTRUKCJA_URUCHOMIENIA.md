# Instrukcja Uruchomienia Projektu TaskFlow

## 1. Wymagania Systemowe

### Backend (Java)
- Java JDK 17 lub nowszy
- Maven 3.9.x lub nowszy
- PostgreSQL 15 lub nowszy

### Frontend (React/Next.js)
- Node.js 18.x lub nowszy
- npm 9.x lub nowszy

### Opcjonalnie
- Docker i Docker Compose
- IDE: IntelliJ IDEA (backend), VS Code (frontend)

## 2. Konfiguracja Bazy Danych

### 2.1 Instalacja PostgreSQL

#### Windows:
1. Pobierz instalator z https://www.postgresql.org/download/windows/
2. Uruchom instalator i postępuj według instrukcji
3. Zapamiętaj hasło dla użytkownika `postgres`

#### macOS:
```bash
brew install postgresql@15
brew services start postgresql@15
```

#### Linux (Ubuntu/Debian):
```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
```

### 2.2 Utworzenie Bazy Danych

```bash
# Zaloguj się do PostgreSQL
psql -U postgres

# Utwórz bazę danych
CREATE DATABASE taskflow;

# Utwórz użytkownika
CREATE USER taskflow_user WITH PASSWORD 'taskflow_password';

# Nadaj uprawnienia
GRANT ALL PRIVILEGES ON DATABASE taskflow TO taskflow_user;

# Wyjdź
\q
```

## 3. Uruchomienie Backend (Spring Boot)

### 3.1 Konfiguracja

Skopiuj plik `application.properties.example` do `application.properties` i uzupełnij:

```properties
# Database
spring.datasource.url=jdbc:postgresql://localhost:5432/taskflow
spring.datasource.username=taskflow_user
spring.datasource.password=taskflow_password

# JWT
jwt.secret=your-256-bit-secret-key-here-minimum-32-characters
jwt.expiration=86400000
