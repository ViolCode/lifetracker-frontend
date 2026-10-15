LifeTracker — Frontend

LifeTracker is a web application for organizing events and tracking related expenses. This repository contains the React frontend, including the login and registration screens and the main schedule, expenses, and event-history pages.
The frontend communicates with the separately maintained LifeTracker backend.

Features:
- Login and registration screens
- Protected application routes
- Schedule and event views
- Expense tracking interface
- Event history
- Client-side navigation using React Router

Technology stack:
- React 19
- Vite
- React Router
- Tailwind CSS
- react-hot-toast
- Docker
- Nginx for serving the production build
- GitLab CI/CD configuration for install and build stages

Prerequisites:
- Node.js compatible with the Vite version used by the project
- npm
- The LifeTracker backend running separately for API-backed functionality

Getting started
1. Clone this repository and open a terminal in its root directory.
2. Install dependencies:
   npm install
3. Configure the backend URL in a local .env file:
   VITE_API_URL=http://localhost:8080
   Change the URL if your backend runs elsewhere. Vite exposes variables prefixed with VITE_ to client-side code, so do not put secrets in these variables.
4. Start the development server:
   npm run dev
   Open the local URL printed by Vite.
Available scripts
Command	Purpose
npm run dev	Start the Vite development server
npm run build	Build the production frontend
npm run preview	Preview the production build locally

Docker

The included Dockerfile builds the frontend with Node.js and serves the generated static files through Nginx.

Build the image:
docker build -t lifetracker-frontend .

Run the container:
docker run --rm -p 8081:80 lifetracker-frontend
Then open http://localhost:8081.
