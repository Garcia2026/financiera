# app-finaciera-3
financiera
# financiera
# financiera

## Theme selection

Use the theme selector in the application's top bar to switch between `light`,
`dark` and the new `corporativo` appearance. The chosen option is saved and
restored on your next visit. Colors for each style are defined through CSS
variables in `src/assets/css/themes.css` so you can easily tweak them.

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
