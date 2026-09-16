# Campspace

A production-quality MERN application for modern campus communities, bringing together students, organizers, and campus administration.

## Project Structure

```
Campspace/
├── client/
│   ├── src/
│   │   ├── components/       # Shared UI components
│   │   ├── layouts/          # Page layouts (MainLayout)
│   │   ├── pages/            # Feature page modules
│   │   │   ├── auth/         # Shared Authentication
│   │   │   ├── dashboard/    # Shared Dashboard
│   │   │   ├── marketplace/  # Developer 1: Marketplace
│   │   │   ├── events/       # Developer 1: Events
│   │   │   ├── resources/    # Developer 2: Resource Allocation
│   │   │   └── clubs/        # Developer 2: Clubs
│   │   ├── services/         # Axios API client & endpoints
│   │   ├── hooks/            # Custom React hooks
│   │   ├── context/          # Context providers (AuthContext)
│   │   ├── utils/            # Client utility helpers
│   │   └── routes/           # Central route configuration (AppRoutes)
│   ├── package.json
│   └── vite.config.js
├── server/
│   ├── src/
│   │   ├── config/           # Environment & MongoDB configuration
│   │   ├── models/           # Mongoose schemas & models
│   │   ├── routes/           # Express route definitions
│   │   ├── controllers/      # HTTP request controllers
│   │   ├── services/         # Business logic layer
│   │   ├── middleware/       # Centralized error & request middleware
│   │   ├── validators/       # Request validation schemas
│   │   ├── utils/            # Server utility helpers
│   │   ├── app.js            # Express app configuration
│   │   └── server.js         # HTTP server entrypoint
│   └── package.json
├── docs/                     # Project documentation
└── README.md
```

## Module Ownership

- **Developer 1**:
  - Marketplace
  - Events
- **Developer 2**:
  - Resource Allocation / Booking
  - Clubs
- **Shared**:
  - Authentication
  - Shared UI
  - Dashboard
  - Integration
  - Testing
  - Git/GitHub
  - Deployment
  - Documentation

## Technology Stack

| Layer      | Technology                          |
| ---------- | ----------------------------------- |
| Frontend   | React 18, React Router 6, Vite, Axios |
| Backend    | Node.js, Express.js                 |
| Database   | MongoDB, Mongoose                   |
| Styling    | Modern Vanilla CSS & Design Tokens  |

## Getting Started

### 1. Backend Setup

```bash
cd server
cp .env.example .env
npm install
npm start
```

Health Check:
```bash
curl http://localhost:5000/api/health
```

### 2. Frontend Setup

```bash
cd client
cp .env.example .env
npm install
npm run dev
```

Visit `http://localhost:5173` in your browser.
