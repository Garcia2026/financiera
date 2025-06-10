# app-finaciera-3
financiera
# financiera
# financiera

## Theme selection

Use the theme selector in the application's top bar to switch between `light`, `dark` and the new `corporativo` appearance. The chosen option is saved and restored on your next visit.

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

## Build and run

Install dependencies with:

```bash
npm install
```

Start a development server:

```bash
npm run dev
```

Create a production build:

```bash
npm run build
```

Preview the compiled app:

```bash
npm run serve
```
