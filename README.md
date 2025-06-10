# Financiera

Financiera is a Vue 3 application for managing store finances. The app lets you track expenses, register shops, manage quotes and view statistics using Firebase as a backend.

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```
2. Run the development server:
   ```bash
   npm run dev
   ```
3. Build for production:
   ```bash
   npm run build
   ```
4. (Optional) Preview the production build:
   ```bash
   npm run serve
   ```

## Environment Variables

Copy `.env.example` to `.env` and update the values with your Firebase credentials or custom base URL.

```bash
cp .env.example .env
```

### Example

```env
VITE_BASE_URL="/"
VITE_FIREBASE_API_KEY="your_api_key"
VITE_FIREBASE_AUTH_DOMAIN="your_auth_domain"
VITE_FIREBASE_PROJECT_ID="your_project_id"
VITE_FIREBASE_STORAGE_BUCKET="your_storage_bucket"
VITE_FIREBASE_MESSAGING_SENDER_ID="your_sender_id"
VITE_FIREBASE_APP_ID="your_app_id"
VITE_FIREBASE_MEASUREMENT_ID="your_measurement_id"
```
