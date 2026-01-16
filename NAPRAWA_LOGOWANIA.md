# 🔧 Naprawa logowania - 403/500 Error

## Problem:
- Frontend zwraca 503/500 przy logowaniu
- Backend zwraca 403 Forbidden

## ✅ Rozwiązanie (2 minuty):

### Krok 1: Ustaw zmienną w Vercel (Frontend)

1. **Idź do:** https://vercel.com → Twój projekt → **Settings** → **Environment Variables**
2. **Dodaj/Edytuj:**
   ```
   JAVA_BACKEND_URL=https://taskflow-backend-xjow.onrender.com
   ```
3. **Zapisz**
4. **Deployments** → **...** → **Redeploy** (lub poczekaj na automatyczny redeploy)

### Krok 2: Ustaw CORS w Render (Backend)

1. **Idź do:** https://dashboard.render.com → Twój backend service → **Environment**
2. **Dodaj/Edytuj zmienną:**
   ```
   ALLOWED_ORIGINS=https://v0-project-evaluation-criteria.vercel.app
   ```
   ⚠️ **WAŻNE:** Zamień `v0-project-evaluation-criteria.vercel.app` na **TWÓJ** URL frontendu z Vercel!
3. **Zapisz** - Render automatycznie zrestartuje aplikację

### Krok 3: Sprawdź czy działa

1. Poczekaj 1-2 minuty na redeploy
2. Spróbuj się zalogować ponownie
3. ✅ Powinno działać!

---

## 🔍 Jak znaleźć swój URL frontendu?

W Vercel:
- **Deployments** → kliknij najnowszy deployment → zobaczysz URL w górnej części

Lub sprawdź w przeglądarce - URL w pasku adresu to Twój frontend URL.

---

## ⚠️ Jeśli nadal nie działa:

1. **Sprawdź logi w Render:**
   - Render → Twój backend → **Logs**
   - Szukaj błędów CORS lub połączenia

2. **Sprawdź czy backend odpowiada:**
   - Otwórz: `https://taskflow-backend-xjow.onrender.com/api/v1/health`
   - Powinno zwrócić: `{"status":"UP",...}`

3. **Sprawdź zmienne w Vercel:**
   - Upewnij się, że `JAVA_BACKEND_URL` jest ustawione dla **Production** environment
