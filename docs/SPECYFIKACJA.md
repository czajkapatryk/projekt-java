# Specyfikacja Projektu: TaskFlow - System Zarządzania Zadaniami

## 1. Opis Projektu

**TaskFlow** to aplikacja webowa do zarządzania zadaniami i projektami, umożliwiająca użytkownikom organizację pracy, śledzenie postępów oraz współpracę w zespole. System oferuje intuicyjny interfejs do tworzenia, edycji i monitorowania zadań z podziałem na projekty i kategorie.

## 2. Odbiorcy Docelowi

### Główni odbiorcy:
- **Małe i średnie zespoły projektowe** - grupy 2-20 osób pracujących nad wspólnymi projektami
- **Freelancerzy** - osoby zarządzające wieloma projektami dla różnych klientów
- **Studenci** - do organizacji pracy nad projektami grupowymi i indywidualnymi
- **Startupy** - młode firmy potrzebujące lekkiego narzędzia do zarządzania zadaniami

### Persony użytkowników:
1. **Project Manager** - zarządza projektami, przypisuje zadania, monitoruje postępy
2. **Developer/Wykonawca** - realizuje przypisane zadania, raportuje postępy
3. **Administrator** - zarządza użytkownikami i konfiguracją systemu

## 3. Korzyści Biznesowe

| Korzyść | Opis |
|---------|------|
| **Zwiększona produktywność** | Centralizacja zadań redukuje chaos i zwiększa efektywność o 30-40% |
| **Lepsza komunikacja** | Przejrzyste przypisanie odpowiedzialności eliminuje nieporozumienia |
| **Śledzenie postępów** | Real-time monitoring umożliwia szybką reakcję na opóźnienia |
| **Redukcja kosztów** | Eliminacja potrzeby drogich narzędzi enterprise |
| **Skalowalność** | System rośnie wraz z organizacją |

## 4. Wymagania Funkcjonalne

### 4.1 Zarządzanie Użytkownikami
| ID | Wymaganie | Priorytet |
|----|-----------|-----------|
| F001 | Rejestracja nowego użytkownika | Wysoki |
| F002 | Logowanie/wylogowanie | Wysoki |
| F003 | Edycja profilu użytkownika | Średni |
| F004 | Reset hasła | Średni |

### 4.2 Zarządzanie Projektami
| ID | Wymaganie | Priorytet |
|----|-----------|-----------|
| F005 | Tworzenie nowego projektu | Wysoki |
| F006 | Edycja projektu | Wysoki |
| F007 | Usuwanie projektu | Wysoki |
| F008 | Lista projektów użytkownika | Wysoki |
| F009 | Przypisywanie użytkowników do projektu | Średni |

### 4.3 Zarządzanie Zadaniami
| ID | Wymaganie | Priorytet |
|----|-----------|-----------|
| F010 | Tworzenie zadania | Wysoki |
| F011 | Edycja zadania | Wysoki |
| F012 | Usuwanie zadania | Wysoki |
| F013 | Zmiana statusu zadania | Wysoki |
| F014 | Przypisanie zadania do użytkownika | Wysoki |
| F015 | Ustawienie priorytetu zadania | Średni |
| F016 | Ustawienie terminu wykonania | Średni |
| F017 | Filtrowanie i sortowanie zadań | Średni |

### 4.4 Dashboard i Raportowanie
| ID | Wymaganie | Priorytet |
|----|-----------|-----------|
| F018 | Widok tablicy Kanban | Wysoki |
| F019 | Statystyki projektu | Niski |
| F020 | Historia zmian zadania | Niski |

## 5. Wymagania Pozafunkcjonalne

### 5.1 Wydajność
| ID | Wymaganie | Metryka |
|----|-----------|---------|
| NF001 | Czas odpowiedzi API | < 500ms dla 95% requestów |
| NF002 | Obsługa równoczesnych użytkowników | Min. 100 użytkowników |
| NF003 | Czas ładowania strony | < 3 sekundy |

### 5.2 Bezpieczeństwo
| ID | Wymaganie | Opis |
|----|-----------|------|
| NF004 | Szyfrowanie haseł | BCrypt z salt |
| NF005 | Autoryzacja JWT | Token ważny 24h |
| NF006 | Walidacja danych wejściowych | Wszystkie endpointy |
| NF007 | Ochrona przed SQL Injection | Prepared statements |

### 5.3 Niezawodność
| ID | Wymaganie | Metryka |
|----|-----------|---------|
| NF008 | Dostępność systemu | 99% uptime |
| NF009 | Backup bazy danych | Co 24h |

### 5.4 Utrzymanie
| ID | Wymaganie | Opis |
|----|-----------|------|
| NF010 | Dokumentacja kodu | JavaDoc dla wszystkich klas publicznych |
| NF011 | Pokrycie testami | Min. 60% kodu |
| NF012 | Logowanie błędów | SLF4J + Logback |

## 6. Ograniczenia i Założenia

### Ograniczenia:
- Aplikacja wymaga połączenia z internetem
- Obsługiwane przeglądarki: Chrome 90+, Firefox 88+, Safari 14+, Edge 90+
- Minimalna rozdzielczość ekranu: 320px (mobile)

### Założenia:
- Użytkownicy posiadają podstawową znajomość obsługi aplikacji webowych
- Serwer aplikacji ma dostęp do bazy danych PostgreSQL
- System będzie wdrożony w środowisku z Java 17+
