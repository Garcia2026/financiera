# Financiera

Web application to manage financial operations with Firebase and Vue.js.

## Theme Selection

Use the theme selector in the application's top bar to switch between `light`, `dark` and the `corporativo` appearance. The chosen option is saved and restored on your next visit.

## Prerequisites

- Node.js 18 or later
- npm
- (Optional) `firebase-tools` for deployment

## Installation

```bash
npm install
```

## Development Server

Run the app locally with hot reloading:

```bash
npm run dev
```

## Building for Production

Generate the optimized production build:

```bash
npm run build
```

The build output is placed in the `dist` directory.

## Deployment

You can preview the production build locally with:

```bash
npm run serve
```

To deploy to Firebase Hosting, ensure you have `firebase-tools` installed and run:

```bash
firebase deploy
```

## Environment Variables

Create a `.env` file in the project root with your Firebase credentials:

```
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
VITE_FIREBASE_MEASUREMENT_ID=
```

These variables are used in `src/firebase.js` to initialize Firebase.

## Features

- User authentication with Firebase
- Dashboard showing recent activity and summaries
- Store management module (Tiendas)
- Collections tracking (Cobros) and statistics
- Expense tracker with charts and reports
- Quote management section for customers
- Customizable light/dark/corporativo themes
