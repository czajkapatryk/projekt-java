# Dokumentacja Techniczna: TaskFlow

## 1. Stos Technologiczny

### Backend
| Technologia | Wersja | Przeznaczenie |
|-------------|--------|---------------|
| Java | 17 LTS | Język programowania |
| Spring Boot | 3.2.x | Framework aplikacyjny |
| Spring Security | 6.x | Bezpieczeństwo i autoryzacja |
| Spring Data JPA | 3.2.x | Warstwa dostępu do danych |
| Hibernate | 6.x | ORM |
| Maven | 3.9.x | Zarządzanie zależnościami |
| JUnit 5 | 5.10.x | Testy jednostkowe |
| Mockito | 5.x | Mockowanie w testach |
| Lombok | 1.18.x | Redukcja boilerplate |

### Baza Danych
| Technologia | Wersja | Przeznaczenie |
|-------------|--------|---------------|
| PostgreSQL | 15+ | Relacyjna baza danych |
| Flyway | 9.x | Migracje bazy danych |

### Frontend
| Technologia | Wersja | Przeznaczenie |
|-------------|--------|---------------|
| React | 18.x | Biblioteka UI |
| Next.js | 15.x | Framework React |
| TypeScript | 5.x | Typowanie statyczne |
| Tailwind CSS | 4.x | Stylowanie |
| Axios/Fetch | - | Komunikacja z API |

### Narzędzia Deweloperskie
| Narzędzie | Przeznaczenie |
|-----------|---------------|
| IntelliJ IDEA | IDE dla Java |
| VS Code | IDE dla Frontend |
| Postman | Testowanie API |
| Git | Kontrola wersji |
| Docker | Konteneryzacja |

## 2. Architektura Systemu

### 2.1 Wzorzec Architektoniczny
System wykorzystuje **architekturę warstwową (Layered Architecture)** z podziałem na:

```
┌─────────────────────────────────────────────────────────────┐
│                    WARSTWA PREZENTACJI                       │
│                  (React/Next.js Frontend)                    │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                     WARSTWA API (REST)                       │
│                    (Spring Controllers)                      │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                   WARSTWA LOGIKI BIZNESOWEJ                  │
│                    (Spring Services)                         │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                  WARSTWA DOSTĘPU DO DANYCH                   │
│                  (Spring Data Repositories)                  │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                      BAZA DANYCH                             │
│                      (PostgreSQL)                            │
└─────────────────────────────────────────────────────────────┘
```

### 2.2 Struktura Pakietów (Backend)

```
com.taskflow
├── TaskFlowApplication.java          # Klasa główna
├── config/                           # Konfiguracja
│   ├── SecurityConfig.java
│   ├── CorsConfig.java
│   └── JwtConfig.java
├── controller/                       # Kontrolery REST
│   ├── AuthController.java
│   ├── UserController.java
│   ├── ProjectController.java
│   └── TaskController.java
├── service/                          # Logika biznesowa
│   ├── AuthService.java
│   ├── UserService.java
│   ├── ProjectService.java
│   └── TaskService.java
├── repository/                       # Repozytoria JPA
│   ├── UserRepository.java
│   ├── ProjectRepository.java
│   └── TaskRepository.java
├── model/                            # Encje JPA
│   ├── User.java
│   ├── Project.java
│   └── Task.java
├── dto/                              # Data Transfer Objects
│   ├── request/
│   │   ├── LoginRequest.java
│   │   ├── RegisterRequest.java
│   │   ├── ProjectRequest.java
│   │   └── TaskRequest.java
│   └── response/
│       ├── AuthResponse.java
│       ├── UserResponse.java
│       ├── ProjectResponse.java
│       └── TaskResponse.java
├── exception/                        # Wyjątki
│   ├── ResourceNotFoundException.java
│   ├── UnauthorizedException.java
│   └── GlobalExceptionHandler.java
├── security/                         # Bezpieczeństwo
│   ├── JwtTokenProvider.java
│   └── JwtAuthenticationFilter.java
└── util/                             # Narzędzia pomocnicze
    └── DateUtils.java
```

## 3. Diagram Bazy Danych (ERD)

```
┌──────────────────────┐       ┌──────────────────────┐
│        USERS         │       │      PROJECTS        │
├──────────────────────┤       ├──────────────────────┤
│ id: BIGSERIAL [PK]   │       │ id: BIGSERIAL [PK]   │
│ email: VARCHAR(255)  │──┐    │ name: VARCHAR(100)   │
│ password: VARCHAR    │  │    │ description: TEXT    │
│ first_name: VARCHAR  │  │    │ owner_id: BIGINT [FK]│──┐
│ last_name: VARCHAR   │  │    │ created_at: TIMESTAMP│  │
│ role: VARCHAR(20)    │  │    │ updated_at: TIMESTAMP│  │
│ created_at: TIMESTAMP│  │    └──────────────────────┘  │
│ updated_at: TIMESTAMP│  │              │               │
└──────────────────────┘  │              │               │
         │                │              │ 1:N           │
         │                │              ▼               │
         │                │    ┌──────────────────────┐  │
         │                │    │        TASKS         │  │
         │                │    ├──────────────────────┤  │
         │                │    │ id: BIGSERIAL [PK]   │  │
         │                └───▶│ project_id: BIGINT   │──┘
         │         N:1         │ assignee_id: BIGINT  │
         └────────────────────▶│ title: VARCHAR(200)  │
                               │ description: TEXT    │
                               │ status: VARCHAR(20)  │
                               │ priority: VARCHAR(20)│
                               │ due_date: DATE       │
                               │ created_at: TIMESTAMP│
                               │ updated_at: TIMESTAMP│
                               └──────────────────────┘

┌──────────────────────────┐
│     PROJECT_MEMBERS      │
├──────────────────────────┤
│ project_id: BIGINT [PK]  │──▶ PROJECTS.id
│ user_id: BIGINT [PK]     │──▶ USERS.id
│ role: VARCHAR(20)        │
│ joined_at: TIMESTAMP     │
└──────────────────────────┘
```

### Relacje:
- **USERS → PROJECTS**: 1:N (użytkownik może być właścicielem wielu projektów)
- **PROJECTS → TASKS**: 1:N (projekt zawiera wiele zadań)
- **USERS → TASKS**: 1:N (użytkownik może mieć przypisane wiele zadań)
- **USERS ↔ PROJECTS**: N:M przez PROJECT_MEMBERS (wielu użytkowników w wielu projektach)

## 4. Diagram Klas

```
┌─────────────────────────────────────────────────────────────────────────┐
│                              <<Entity>>                                  │
│                                 User                                     │
├─────────────────────────────────────────────────────────────────────────┤
│ - id: Long                                                               │
│ - email: String                                                          │
│ - password: String                                                       │
│ - firstName: String                                                      │
│ - lastName: String                                                       │
│ - role: UserRole                                                         │
│ - createdAt: LocalDateTime                                               │
│ - updatedAt: LocalDateTime                                               │
│ - ownedProjects: List<Project>                                           │
│ - assignedTasks: List<Task>                                              │
├─────────────────────────────────────────────────────────────────────────┤
│ + getFullName(): String                                                  │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
                                    │ owns
                                    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                              <<Entity>>                                  │
│                               Project                                    │
├─────────────────────────────────────────────────────────────────────────┤
│ - id: Long                                                               │
│ - name: String                                                           │
│ - description: String                                                    │
│ - owner: User                                                            │
│ - tasks: List<Task>                                                      │
│ - members: Set<ProjectMember>                                            │
│ - createdAt: LocalDateTime                                               │
│ - updatedAt: LocalDateTime                                               │
├─────────────────────────────────────────────────────────────────────────┤
│ + addTask(task: Task): void                                              │
│ + removeTask(task: Task): void                                           │
│ + addMember(user: User, role: ProjectRole): void                         │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
                                    │ contains
                                    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                              <<Entity>>                                  │
│                                 Task                                     │
├─────────────────────────────────────────────────────────────────────────┤
│ - id: Long                                                               │
│ - title: String                                                          │
│ - description: String                                                    │
│ - status: TaskStatus                                                     │
│ - priority: TaskPriority                                                 │
│ - dueDate: LocalDate                                                     │
│ - project: Project                                                       │
│ - assignee: User                                                         │
│ - createdAt: LocalDateTime                                               │
│ - updatedAt: LocalDateTime                                               │
├─────────────────────────────────────────────────────────────────────────┤
│ + isOverdue(): boolean                                                   │
│ + changeStatus(newStatus: TaskStatus): void                              │
└─────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────┐    ┌─────────────────────────┐
│      <<Enum>>           │    │       <<Enum>>          │
│      TaskStatus         │    │      TaskPriority       │
├─────────────────────────┤    ├─────────────────────────┤
│ TODO                    │    │ LOW                     │
│ IN_PROGRESS             │    │ MEDIUM                  │
│ IN_REVIEW               │    │ HIGH                    │
│ DONE                    │    │ URGENT                  │
└─────────────────────────┘    └─────────────────────────┘

┌─────────────────────────┐
│       <<Enum>>          │
│       UserRole          │
├─────────────────────────┤
│ USER                    │
│ ADMIN                   │
└─────────────────────────┘
```

### Diagram Klas - Warstwa Serwisów

```
┌─────────────────────────────────────────────────────────────────────────┐
│                            <<Interface>>                                 │
│                             TaskService                                  │
├─────────────────────────────────────────────────────────────────────────┤
│ + getAllTasks(): List<TaskResponse>                                      │
│ + getTaskById(id: Long): TaskResponse                                    │
│ + getTasksByProject(projectId: Long): List<TaskResponse>                 │
│ + getTasksByAssignee(userId: Long): List<TaskResponse>                   │
│ + createTask(request: TaskRequest): TaskResponse                         │
│ + updateTask(id: Long, request: TaskRequest): TaskResponse               │
│ + updateTaskStatus(id: Long, status: TaskStatus): TaskResponse           │
│ + deleteTask(id: Long): void                                             │
└─────────────────────────────────────────────────────────────────────────┘
                                    △
                                    │ implements
                                    │
┌─────────────────────────────────────────────────────────────────────────┐
│                            <<Service>>                                   │
│                          TaskServiceImpl                                 │
├─────────────────────────────────────────────────────────────────────────┤
│ - taskRepository: TaskRepository                                         │
│ - projectRepository: ProjectRepository                                   │
│ - userRepository: UserRepository                                         │
├─────────────────────────────────────────────────────────────────────────┤
│ + getAllTasks(): List<TaskResponse>                                      │
│ + getTaskById(id: Long): TaskResponse                                    │
│ + createTask(request: TaskRequest): TaskResponse                         │
│ + updateTask(id: Long, request: TaskRequest): TaskResponse               │
│ + deleteTask(id: Long): void                                             │
│ - mapToResponse(task: Task): TaskResponse                                │
│ - mapToEntity(request: TaskRequest): Task                                │
└─────────────────────────────────────────────────────────────────────────┘
```

## 5. Dokumentacja REST API

### 5.1 Informacje Ogólne

| Parametr | Wartość |
|----------|---------|
| Base URL | `http://localhost:8080/api/v1` |
| Format danych | JSON |
| Autentykacja | JWT Bearer Token |
| Wersjonowanie | URL path (`/api/v1/`) |

### 5.2 Endpointy Autentykacji

#### POST /api/v1/auth/register
Rejestracja nowego użytkownika.

**Request Body:**
```json
{
  "email": "jan.kowalski@email.com",
  "password": "SecurePass123!",
  "firstName": "Jan",
  "lastName": "Kowalski"
}
```

**Response (201 Created):**
```json
{
  "id": 1,
  "email": "jan.kowalski@email.com",
  "firstName": "Jan",
  "lastName": "Kowalski",
  "role": "USER",
  "createdAt": "2024-01-15T10:30:00"
}
```

#### POST /api/v1/auth/login
Logowanie użytkownika.

**Request Body:**
```json
{
  "email": "jan.kowalski@email.com",
  "password": "SecurePass123!"
}
```

**Response (200 OK):**
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "tokenType": "Bearer",
  "expiresIn": 86400,
  "user": {
    "id": 1,
    "email": "jan.kowalski@email.com",
    "firstName": "Jan",
    "lastName": "Kowalski"
  }
}
```

### 5.3 Endpointy Projektów

#### GET /api/v1/projects
Pobierz listę projektów użytkownika.

**Headers:** `Authorization: Bearer {token}`

**Response (200 OK):**
```json
{
  "content": [
    {
      "id": 1,
      "name": "Website Redesign",
      "description": "Przeprojektowanie strony firmowej",
      "owner": {
        "id": 1,
        "firstName": "Jan",
        "lastName": "Kowalski"
      },
      "taskCount": 12,
      "completedTaskCount": 5,
      "createdAt": "2024-01-10T09:00:00"
    }
  ],
  "totalElements": 1,
  "totalPages": 1,
  "currentPage": 0
}
```

#### POST /api/v1/projects
Utwórz nowy projekt.

**Headers:** `Authorization: Bearer {token}`

**Request Body:**
```json
{
  "name": "Mobile App Development",
  "description": "Rozwój aplikacji mobilnej dla klienta X"
}
```

**Response (201 Created):**
```json
{
  "id": 2,
  "name": "Mobile App Development",
  "description": "Rozwój aplikacji mobilnej dla klienta X",
  "owner": {
    "id": 1,
    "firstName": "Jan",
    "lastName": "Kowalski"
  },
  "taskCount": 0,
  "completedTaskCount": 0,
  "createdAt": "2024-01-15T11:00:00"
}
```

#### GET /api/v1/projects/{id}
Pobierz szczegóły projektu.

#### PUT /api/v1/projects/{id}
Aktualizuj projekt.

#### DELETE /api/v1/projects/{id}
Usuń projekt.

### 5.4 Endpointy Zadań

#### GET /api/v1/tasks
Pobierz listę zadań z filtrami.

**Query Parameters:**
| Parametr | Typ | Opis |
|----------|-----|------|
| projectId | Long | Filtruj po projekcie |
| status | String | Filtruj po statusie (TODO, IN_PROGRESS, IN_REVIEW, DONE) |
| priority | String | Filtruj po priorytecie (LOW, MEDIUM, HIGH, URGENT) |
| assigneeId | Long | Filtruj po przypisanym użytkowniku |

**Response (200 OK):**
```json
{
  "content": [
    {
      "id": 1,
      "title": "Zaprojektować UI logowania",
      "description": "Stworzyć mockupy dla ekranu logowania",
      "status": "IN_PROGRESS",
      "priority": "HIGH",
      "dueDate": "2024-01-20",
      "project": {
        "id": 1,
        "name": "Website Redesign"
      },
      "assignee": {
        "id": 2,
        "firstName": "Anna",
        "lastName": "Nowak"
      },
      "createdAt": "2024-01-12T14:00:00"
    }
  ],
  "totalElements": 1,
  "totalPages": 1,
  "currentPage": 0
}
```

#### POST /api/v1/tasks
Utwórz nowe zadanie.

**Request Body:**
```json
{
  "title": "Implementacja REST API",
  "description": "Zaimplementować endpointy dla modułu użytkowników",
  "projectId": 1,
  "assigneeId": 2,
  "priority": "HIGH",
  "dueDate": "2024-01-25"
}
```

#### PUT /api/v1/tasks/{id}
Aktualizuj zadanie.

#### PATCH /api/v1/tasks/{id}/status
Zmień status zadania.

**Request Body:**
```json
{
  "status": "DONE"
}
```

#### DELETE /api/v1/tasks/{id}
Usuń zadanie.

### 5.5 Kody Odpowiedzi HTTP

| Kod | Znaczenie | Kiedy używany |
|-----|-----------|---------------|
| 200 | OK | Sukces GET, PUT, PATCH |
| 201 | Created | Sukces POST (utworzono zasób) |
| 204 | No Content | Sukces DELETE |
| 400 | Bad Request | Błędne dane wejściowe |
| 401 | Unauthorized | Brak lub nieprawidłowy token |
| 403 | Forbidden | Brak uprawnień do zasobu |
| 404 | Not Found | Zasób nie istnieje |
| 409 | Conflict | Konflikt (np. email już istnieje) |
| 500 | Internal Server Error | Błąd serwera |

### 5.6 Format Błędów

```json
{
  "timestamp": "2024-01-15T12:00:00",
  "status": 400,
  "error": "Bad Request",
  "message": "Validation failed",
  "details": [
    {
      "field": "email",
      "message": "Email is required"
    },
    {
      "field": "password",
      "message": "Password must be at least 8 characters"
    }
  ],
  "path": "/api/v1/auth/register"
}
