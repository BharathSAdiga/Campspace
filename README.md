# CampusConnect

A unified digital campus platform for students, event organizers, and administrators. Built with the MERN stack.

## Technology Stack

| Layer      | Technology                          |
| ---------- | ----------------------------------- |
| Frontend   | React, React Router, Vite           |
| Backend    | Node.js, Express.js                 |
| Database   | MongoDB, Mongoose                   |
| Auth       | JWT (jsonwebtoken), bcryptjs        |
| Styling    | Vanilla CSS (custom design system)  |
| Icons      | Lucide React                        |

## Project Structure

```
CampSpace/
│
├── client/
│   └── src/
│       ├── components/
│       ├── pages/
│       │   ├── marketplace/
│       │   ├── events/
│       │   ├── resources/
│       │   ├── clubs/
│       │   └── auth/
│       │
│       ├── context/
│       ├── services/
│       └── App.jsx
│
├── server/
│   ├── models/
│   │   ├── User.js
│   │   ├── Product.js
│   │   ├── Event.js
│   │   ├── EventRegistration.js
│   │   ├── Resource.js
│   │   ├── Booking.js
│   │   ├── Club.js
│   │   └── ClubMember.js
│   │
│   ├── controllers/
│   │   ├── productController.js
│   │   ├── eventController.js
│   │   ├── resourceController.js
│   │   ├── bookingController.js
│   │   └── clubController.js
│   │
│   ├── routes/
│   │   ├── productRoutes.js
│   │   ├── eventRoutes.js
│   │   ├── resourceRoutes.js
│   │   ├── bookingRoutes.js
│   │   └── clubRoutes.js
│   │
│   ├── middleware/
│   │   ├── authMiddleware.js
│   │   └── errorMiddleware.js
│   │
│   └── server.js
│
└── README.md
```

## Local Setup

### Prerequisites

- [Node.js](https://nodejs.org/) v18 or higher
- [MongoDB](https://www.mongodb.com/try/download/community) running locally, **or** a MongoDB Atlas connection string
- [Git](https://git-scm.com/)

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/BharathSAdiga/Camspace.git
   cd Camspace
   ```

2. **Set up the backend**

   ```bash
   cd server
   cp .env.example .env
   # Edit .env with your MongoDB URI and a strong JWT secret
   npm install
   ```

3. **Set up the frontend**

   ```bash
   cd ../client
   npm install
   ```

## Environment Variables

### Server (`server/.env`)

| Variable       | Description                              | Required |
| -------------- | ---------------------------------------- | -------- |
| `PORT`         | Server port (default: `5000`)            | No       |
| `NODE_ENV`     | Environment (`development`/`production`) | No       |
| `MONGODB_URI`  | MongoDB connection string                | Yes      |
| `JWT_SECRET`   | Secret key for signing JWT tokens        | Yes      |
| `JWT_EXPIRES_IN` | Token expiry duration (default: `7d`)  | No       |
| `CLIENT_URL`   | Frontend origin for CORS (default: `http://localhost:5173`) | No |

### Client (`client/.env`)

| Variable       | Description                              | Required |
| -------------- | ---------------------------------------- | -------- |
| `VITE_API_URL` | Backend API base URL                     | No       |

> **Note:** The Vite dev server proxies `/api` requests to the backend automatically. Client `.env` variables are optional during local development.

## Development Commands

### Backend

```bash
cd server

npm run dev       # Start with hot-reload (nodemon)
npm start         # Start production server
```

### Frontend

```bash
cd client

npm run dev       # Start Vite dev server (port 5173)
npm run build     # Production build
npm run preview   # Preview production build locally
```

### Quick Start (both servers)

Open two terminals:

```bash
# Terminal 1 — Backend
cd server && npm run dev

# Terminal 2 — Frontend
cd client && npm run dev
```

Then open [http://localhost:5173](http://localhost:5173) in your browser.

## API Health Check

```bash
curl http://localhost:5000/api/health
```

Expected response:

```json
{
  "success": true,
  "message": "CampusConnect API is running",
  "timestamp": "2026-09-16T00:00:00.000Z",
  "environment": "development"
}
```

## License

This project is for educational purposes.
