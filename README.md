# Netflix-style Login Demo

A simple full-stack login demo built with React + Vite on the frontend and Express on the backend.

## Features
- Netflix-inspired login UI
- Frontend validation
- Mock backend authentication
- Password hashing before sending to the backend
- Five failed-login attempt lockout

## Run locally

### 1) Install dependencies
```bash
npm install
cd frontend && npm install
```

### 2) Start the backend
From the project root:
```bash
npm start
```

### 3) Start the frontend
In a second terminal:
```bash
cd frontend
npm run dev
```

The frontend will be available at http://127.0.0.1:5173/ and the backend at http://localhost:5000/.

### Optional deployment environment variable
For hosted deployments, set:
```bash
VITE_API_URL=https://your-backend-url.com
```

## Demo credentials
- Email: user@netflix.com
- Password: Password123!
