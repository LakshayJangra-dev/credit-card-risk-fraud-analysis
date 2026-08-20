# Risk Console — Frontend

React + Vite + Tailwind v4 frontend for the Credit Risk & Fraud Analysis
system. Login → Signup → Dashboard, styled to match the "instrument panel"
dark theme, talking to the Flask backend (`api.py` from the main project).

## Structure

```
src/
  api/client.js              All backend calls in one place (scoring + auth)
  context/AuthContext.jsx    Auth state (user, login, signup, logout)
  components/
    AuthShell.jsx             Shared chrome for Login/Signup
    Header.jsx                 Dashboard top bar (brand, model status, logout)
    TabBar.jsx                 Credit / Fraud / Combined tab switcher
    Gauge.jsx                   Semicircular score/risk dial (SVG)
    ResultDisplay.jsx           DecisionBadge + FactorsList (SHAP factors)
    ResultPanel.jsx             Picks the right display for the active tab
    NumberField.jsx             Labeled numeric input
    RequireAuth.jsx             Route guard — redirects to /login if signed out
    forms/
      CreditForm.jsx
      FraudForm.jsx
      CombinedForm.jsx
  pages/
    Login.jsx
    Signup.jsx
    Dashboard.jsx
  constants/fields.js          Shared field configs (credit + fraud inputs)
  App.jsx                      Router (react-router-dom)
  main.jsx / index.css         Entry point, Tailwind + font imports
```

## Setup

```bash
npm install
npm run dev       # http://localhost:5173
```

The Vite dev server proxies `/credit`, `/fraud`, `/combined`, `/health`, and
`/auth` to `http://localhost:5000` (see `vite.config.js`), so run the Flask
backend alongside it:

```bash
# in the main project folder, in a separate terminal
python3 train_and_demo.py   # first time only
python3 api.py
```

## Production build

```bash
npm run build     # outputs to dist/
```
Serve `dist/` behind whatever reverse proxy/static host you use, forwarding
API paths to the Flask app the same way the dev proxy does.

## Wiring up real auth

**Right now, login/signup are mocked** in `src/api/client.js` — any
syntactically valid email/password "succeeds" and is stored in
`localStorage`. There's no `/auth/*` route in `api.py` yet. To make this
real:

1. Add `/auth/signup` and `/auth/login` endpoints to `api.py` that hash
   passwords (e.g. `werkzeug.security.generate_password_hash`) and issue a
   session cookie or JWT.
2. In `src/api/client.js`, uncomment the real-backend blocks in `login()`
   and `signup()` and delete the mock `sleep()`/localStorage lines above
   them.
3. Decide on session persistence: cookies (simplest, works with the Vite
   proxy as-is) or a bearer token stored in memory/localStorage attached to
   each fetch call in `client.js`.

I can build the actual `/auth` endpoints (with password hashing and
sessions) if you want the login to be real rather than mocked — just ask.

## Design tokens

Matches the dashboard.html instrument-panel theme:
- Background `#0E1217`, panels `#161B22`, borders `#262E39`
- Accent `#4C8BF5`, good `#3FB37F`, warn `#E8A33D`, bad `#E5484D`
- Headings: Space Grotesk · Body: Inter · Numbers/data: JetBrains Mono
