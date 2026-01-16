# TaskFlow - System Zarządzania Zadaniami

Aplikacja do zarządzania projektami i zadaniami zbudowana z:
- **Backend:** Java Spring Boot + PostgreSQL (Neon)
- **Frontend:** Next.js + React + TypeScript

## 🚀 Szybki Start

Zobacz [JAK_URUCHOMIC.md](./JAK_URUCHOMIC.md) dla instrukcji uruchomienia lokalnego.

## 📦 Wdrożenie Produkcyjne

Zobacz [DEPLOY.md](./DEPLOY.md) dla szczegółowej instrukcji wdrożenia.

## ⚙️ Wymagania

- Java 17+
- Maven 3.9+
- Node.js 18+
- pnpm
- Baza danych Neon PostgreSQL (już skonfigurowana przez v0)

## 🔑 Zmienne Środowiskowe

### Backend Java
- `DATABASE_URL` - URL do bazy Neon PostgreSQL
- `JWT_SECRET` - Sekretny klucz do JWT (min. 32 znaki)
- `PORT` - Port serwera (domyślnie 8080)
- `ALLOWED_ORIGINS` - Dozwolone domeny CORS (oddzielone przecinkami)

### Frontend Next.js
- `DATABASE_URL` - URL do bazy Neon PostgreSQL
- `JAVA_BACKEND_URL` - URL do backendu Java
- `NEXT_PUBLIC_API_URL` - Publiczny URL API (opcjonalne)

## 📁 Struktura Projektu

```
projekt-java/
├── java-backend/          # Backend Spring Boot
│   ├── src/main/java/     # Kod źródłowy Java
│   └── src/main/resources/ # Konfiguracja
├── app/                   # Next.js App Router
│   └── api/              # API Routes (proxy do backendu)
├── components/            # Komponenty React
├── lib/                   # Utilities i API client
└── public/                # Statyczne pliki
```

## 🛠️ Komendy

### Backend
```bash
cd java-backend
mvn clean install
mvn spring-boot:run
```

### Frontend
```bash
pnpm install
pnpm dev
pnpm build
pnpm start
```

## 📝 Dane Demo

Po pierwszym uruchomieniu możesz zalogować się:
- Email: `jan.kowalski@example.com`
- Hasło: `password123`

## 🔒 Bezpieczeństwo

- Hasła są hashowane używając BCrypt
- Autentykacja przez JWT tokens
- CORS skonfigurowany dla bezpieczeństwa
- Wszystkie wrażliwe dane w zmiennych środowiskowych