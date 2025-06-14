# app-finaciera-3
financiera
# financiera
# financiera

## Theme selection

Use the theme selector in the application's top bar to switch between `light`, `dark`, `corporativo`, `md3` (Material Design 3) and the new `tiendas` appearance. The chosen option is saved and restored on your next visit.

## Environment variables

Firebase credentials are required for development. Copy `.env.example` to `.env` and fill in your project's values:

```bash
cp .env.example .env
# edit .env and provide your Firebase keys
```

The following variables must be set:

- `VITE_FIREBASE_API_KEY`
- `VITE_FIREBASE_AUTH_DOMAIN`
- `VITE_FIREBASE_PROJECT_ID`
- `VITE_FIREBASE_STORAGE_BUCKET`
- `VITE_FIREBASE_MESSAGING_SENDER_ID`
- `VITE_FIREBASE_APP_ID`
- `VITE_FIREBASE_MEASUREMENT_ID`

## Design system

This project uses **Tailwind CSS** with a small configuration located in `tailwind.config.js`. The configuration extends the default sans-serif font stack with `Inter`:

```js
const defaultTheme = require('tailwindcss/defaultTheme')
module.exports = {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', ...defaultTheme.fontFamily.sans],
      },
    },
  },
  plugins: [],
}
```

Colors and themes are defined using CSS variables in `src/assets/css/themes.css`. Four themes are available: **light**, **dark**, **corporativo** and **tiendas** (plus the optional **md3**). Each theme defines variables such as `--bg-primary`, `--text-primary` and brand accent colors.

Example corporate palette:
- `--bg-primary: #f5f7fa`
- `--text-primary: #00264d`
- `--brand-blue: #3B82F6`

Reusable component styles live in `src/assets/css/light-components.css` and include helpers like `light-card`, `md3-card`, `input-primary` and `select-input`.

## Adding dashboard features

The dashboard view (`src/views/Dashboard.vue`) exposes several ready‑made blocks:

- **Summary cards** – `<div class="summary-card">` for KPIs.
- **Chart containers** – `<div class="chart-container">` for charts.
- **Metric cards** – `<div class="metric-card">` for compact statistics.
- **Quick actions** – `<QuickActions>` with shortcuts to common pages.

When adding new metrics reuse these containers to keep consistent spacing and animations. Place new cards within the existing grids and prefer CSS variables for colors so all themes stay in sync.

## Dashboard layout

Below is a simplified diagram of the intended layout:

```
+-----------------------------------------------------------+
| User info    Dashboard Empresarial              Date/Time |
+-----------------------------------------------------------+
| [Summary Card 1] [Card 2] [Card 3] [Card 4] [Card 5] [Card 6] |
+-----------------------------------------------------------+
| Cash Flow Chart (2/3 width) | Key Metrics (1/3 width)      |
+-----------------------------------------------------------+
| Recent Services Table (full width)                         |
+-----------------------------------------------------------+
```

## Running tests

After installing dependencies with `npm install`, run the test suite:

```bash
npm run test
```

