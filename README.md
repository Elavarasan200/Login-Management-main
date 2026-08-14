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

## Deployment

This project is split into:
- Frontend: static site on GitHub Pages
- Backend: Node/Express app on Render, Railway, Fly.io, or similar

### Frontend environment variable
Create a `.env` file in the `frontend` folder with:
```bash
VITE_API_URL=https://your-backend-url.com
```

For local development, use:
```bash
VITE_API_URL=http://localhost:5000
```

### GitHub Pages deployment
- Push to GitHub
- Enable GitHub Pages in the repository settings
- Use the workflow in `.github/workflows/deploy.yml`

### Backend deployment
Deploy the root app to a Node host and keep the `server.js` process running.

## Demo credentials
- Email: user@netflix.com
- Password: Password123!
