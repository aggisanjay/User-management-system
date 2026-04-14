# User Management System (UMS)

A full-stack **MERN** web application for managing user accounts with secure authentication, role-based access control (RBAC), and user lifecycle management.

![Node.js](https://img.shields.io/badge/Node.js-18+-green)
![React](https://img.shields.io/badge/React-18-blue)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-brightgreen)
![License](https://img.shields.io/badge/License-MIT-yellow)

---

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Database Schema](#database-schema)
- [API Endpoints](#api-endpoints)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Default Admin Credentials](#default-admin-credentials)
- [Deployment](#deployment)
- [Security Measures](#security-measures)

---

## Features

### Authentication
- JWT-based authentication with **access tokens** (15min) and **refresh tokens** (7 days)
- Secure password hashing with **bcrypt** (12 salt rounds)
- Automatic token refresh on expiry
- Self-registration for new users

### Role-Based Access Control (RBAC)
Three user roles with hierarchical permissions:

| Capability | Admin | Manager | User |
|---|:---:|:---:|:---:|
| View all users | ✅ | ✅ | ❌ |
| Create new users | ✅ | ❌ | ❌ |
| Edit any user | ✅ | ✅ (non-admin) | ❌ |
| Assign/change roles | ✅ | ❌ | ❌ |
| Delete (deactivate) users | ✅ | ❌ | ❌ |
| View own profile | ✅ | ✅ | ✅ |
| Edit own profile | ✅ | ✅ | ✅ |

### User Management
- Paginated, searchable user list with filters (role, status)
- Create users with optional auto-generated passwords
- Soft-delete (deactivate) users — prevents login
- Audit trail: `createdAt`, `updatedAt`, `createdBy`, `updatedBy` on every user record

### Frontend
- Dark-themed, modern UI with glassmorphism effects
- Role-based navigation — menu items shown/hidden based on role
- Client-side route guards for protected and role-restricted pages
- Toast notifications for user feedback
- Responsive design (mobile-friendly)

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 18, Vite, React Router v6, Axios, React Icons |
| **Backend** | Node.js, Express 4 |
| **Database** | MongoDB (Mongoose ODM) |
| **Authentication** | JWT (jsonwebtoken), bcryptjs |
| **Security** | Helmet, CORS, express-rate-limit, express-validator |
| **Deployment** | Render (backend) + Vercel (frontend) |

---

## Project Structure

```
User-management-system/
├── client/                         # React frontend (Vite)
│   ├── src/
│   │   ├── components/             # Reusable UI components
│   │   │   ├── Layout.jsx          # Main layout (sidebar + navbar + content)
│   │   │   ├── Navbar.jsx          # Top navigation bar
│   │   │   ├── Sidebar.jsx         # Side navigation with role-based links
│   │   │   ├── ProtectedRoute.jsx  # Auth route guard
│   │   │   ├── RoleGuard.jsx       # RBAC route guard
│   │   │   ├── Pagination.jsx      # Page navigation controls
│   │   │   ├── Modal.jsx           # Confirmation dialog
│   │   │   └── Toast.jsx           # Toast notification system
│   │   ├── context/
│   │   │   └── AuthContext.jsx     # Auth state management (Context API)
│   │   ├── pages/
│   │   │   ├── Login.jsx           # Login page
│   │   │   ├── Register.jsx        # Self-registration page
│   │   │   ├── Dashboard.jsx       # Role-specific dashboard
│   │   │   ├── UserList.jsx        # Paginated user table (admin/manager)
│   │   │   ├── UserDetail.jsx      # Single user view with audit trail
│   │   │   ├── CreateUser.jsx      # Create new user form (admin)
│   │   │   ├── EditUser.jsx        # Edit user form (admin/manager)
│   │   │   ├── Profile.jsx         # View/edit own profile
│   │   │   └── Unauthorized.jsx    # 403 access denied page
│   │   ├── services/
│   │   │   └── api.js              # Axios instance with JWT interceptors
│   │   ├── utils/
│   │   │   └── roles.js            # Role helpers, date formatting, avatars
│   │   ├── App.jsx                 # Router configuration
│   │   ├── App.css                 # Layout & page styles
│   │   ├── index.css               # Design system & global styles
│   │   └── main.jsx                # React DOM entry point
│   ├── .env                        # Frontend environment variables
│   └── package.json
│
├── server/                         # Express backend
│   ├── config/
│   │   └── db.js                   # MongoDB connection
│   ├── controllers/
│   │   ├── authController.js       # Auth endpoint handlers
│   │   └── userController.js       # User CRUD endpoint handlers
│   ├── middleware/
│   │   ├── auth.js                 # JWT verification middleware
│   │   ├── rbac.js                 # Role-based authorization middleware
│   │   ├── validate.js             # Request validation middleware
│   │   └── errorHandler.js         # Global error handler
│   ├── models/
│   │   ├── User.js                 # User schema (Mongoose)
│   │   └── RefreshToken.js         # Refresh token schema
│   ├── routes/
│   │   ├── authRoutes.js           # Auth routes
│   │   └── userRoutes.js           # User management routes
│   ├── services/
│   │   ├── authService.js          # Auth business logic
│   │   └── userService.js          # User CRUD business logic
│   ├── utils/
│   │   ├── generateToken.js        # JWT & refresh token utilities
│   │   └── seedAdmin.js            # Seeds default admin on first run
│   ├── validators/
│   │   ├── authValidator.js        # Auth input validation rules
│   │   └── userValidator.js        # User input validation rules
│   ├── .env                        # Backend environment variables
│   ├── .env.example                # Example env template
│   ├── server.js                   # Express app entry point
│   └── package.json
│
├── .gitignore
└── README.md
```

---

## Database Schema

### User Collection

```javascript
{
  firstName:  { type: String, required: true, maxlength: 50 },
  lastName:   { type: String, required: true, maxlength: 50 },
  email:      { type: String, required: true, unique: true, lowercase: true },
  password:   { type: String, required: true, minlength: 6, select: false },
  role:       { type: String, enum: ['admin', 'manager', 'user'], default: 'user' },
  status:     { type: String, enum: ['active', 'inactive'], default: 'active' },
  createdBy:  { type: ObjectId, ref: 'User', default: null },
  updatedBy:  { type: ObjectId, ref: 'User', default: null },
  createdAt:  { type: Date },  // auto via timestamps
  updatedAt:  { type: Date },  // auto via timestamps
}
```

- Passwords are hashed using **bcrypt** with 12 salt rounds before saving.
- The `password` field is excluded from queries by default (`select: false`).
- The `toJSON` transform strips the password from all API responses.

### RefreshToken Collection

```javascript
{
  token:      { type: String, required: true, unique: true },
  userId:     { type: ObjectId, ref: 'User', required: true },
  expiresAt:  { type: Date, required: true },  // TTL index for auto-deletion
  createdAt:  { type: Date, default: Date.now },
}
```

- A **TTL index** on `expiresAt` automatically removes expired tokens from the database.

---

## API Endpoints

### Authentication

| Method | Route | Description | Auth |
|--------|-------|-------------|------|
| `POST` | `/api/auth/register` | Register new user | Public |
| `POST` | `/api/auth/login` | Login with email/password | Public |
| `POST` | `/api/auth/refresh` | Refresh access token | Public |
| `POST` | `/api/auth/logout` | Revoke refresh token | Public |

### User Management

| Method | Route | Description | Auth |
|--------|-------|-------------|------|
| `GET` | `/api/users` | List all users (paginated, searchable) | Admin, Manager |
| `GET` | `/api/users/profile` | Get own profile | Authenticated |
| `PUT` | `/api/users/profile` | Update own profile (name, password) | Authenticated |
| `GET` | `/api/users/:id` | Get user by ID | Admin, Manager |
| `POST` | `/api/users` | Create new user | Admin |
| `PUT` | `/api/users/:id` | Update user | Admin, Manager* |
| `DELETE` | `/api/users/:id` | Soft-delete (deactivate) user | Admin |

> **\*** Managers can only update non-admin users and cannot assign the admin role.

### Query Parameters for `GET /api/users`

| Parameter | Type | Description |
|-----------|------|-------------|
| `page` | integer | Page number (default: 1) |
| `limit` | integer | Items per page (default: 10, max: 100) |
| `search` | string | Search by name or email |
| `role` | string | Filter by role: `admin`, `manager`, `user` |
| `status` | string | Filter by status: `active`, `inactive` |

### Health Check

| Method | Route | Description |
|--------|-------|-------------|
| `GET` | `/api/health` | Server health check |

---

## Getting Started

### Prerequisites

- **Node.js** v18 or higher
- **npm** v9 or higher
- **MongoDB** — either [MongoDB Atlas](https://www.mongodb.com/atlas) (free tier) or a local MongoDB instance
- **Git**

### 1. Clone the Repository

```bash
git clone https://github.com/YOUR_USERNAME/User-management-system.git
cd User-management-system
```

### 2. Set Up the Backend

```bash
cd server
npm install
```

Create a `.env` file in the `server/` directory (or copy from `.env.example`):

```env
PORT=5000
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/<dbname>
JWT_SECRET=your-super-secret-jwt-key-change-this
JWT_EXPIRES_IN=15m
CLIENT_URL=http://localhost:5173
```

> ⚠️ Replace `MONGODB_URI` with your actual MongoDB connection string and set a strong `JWT_SECRET`.

Start the backend server:

```bash
npm run dev
```

The backend will be running at `http://localhost:5000`. On first start, a default admin user will be created automatically.

### 3. Set Up the Frontend

Open a **new terminal**:

```bash
cd client
npm install
```

Create a `.env` file in the `client/` directory:

```env
VITE_API_URL=http://localhost:5000/api
```

Start the frontend dev server:

```bash
npm run dev
```

The frontend will be running at `http://localhost:5173`.

### 4. Access the Application

Open `http://localhost:5173` in your browser and log in with the default admin credentials (see below).

---

## Environment Variables

### Backend (`server/.env`)

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Server port | `5000` |
| `MONGODB_URI` | MongoDB connection string | — (required) |
| `JWT_SECRET` | Secret key for JWT signing | — (required) |
| `JWT_EXPIRES_IN` | Access token expiry duration | `15m` |
| `CLIENT_URL` | Frontend URL (for CORS) | `http://localhost:5173` |

### Frontend (`client/.env`)

| Variable | Description | Default |
|----------|-------------|---------|
| `VITE_API_URL` | Backend API base URL | `http://localhost:5000/api` |

---

## Default Admin Credentials

On first server start, the following admin user is automatically seeded:

| Field | Value |
|-------|-------|
| Email | `admin@example.com` |
| Password | `Admin@123` |
| Role | `admin` |

> 🔒 **Change the password immediately after first login in production.**

---

## Deployment

### Backend — Render

1. Create a **Web Service** on [Render](https://render.com)
2. Connect your GitHub repository
3. Set the **Root Directory** to `server`
4. Set the **Build Command** to `npm install`
5. Set the **Start Command** to `npm start`
6. Add environment variables in the Render dashboard:
   - `MONGODB_URI` — your MongoDB Atlas connection string
   - `JWT_SECRET` — a strong, unique secret
   - `JWT_EXPIRES_IN` — `15m`
   - `CLIENT_URL` — your deployed frontend URL (e.g., `https://your-app.vercel.app`)

### Frontend — Vercel

1. Create a **New Project** on [Vercel](https://vercel.com)
2. Connect your GitHub repository
3. Set the **Root Directory** to `client`
4. Set the **Framework Preset** to `Vite`
5. Add environment variables:
   - `VITE_API_URL` — your deployed backend URL + `/api` (e.g., `https://your-api.onrender.com/api`)
6. Deploy

> After deployment, update the backend's `CLIENT_URL` environment variable to match the Vercel URL.

---

## Security Measures

- **Password Hashing**: bcrypt with 12 salt rounds
- **JWT Authentication**: Short-lived access tokens (15min) with refresh token rotation
- **Helmet**: Sets secure HTTP headers
- **CORS**: Configured to only accept requests from the frontend origin
- **Rate Limiting**:
  - General API: 100 requests per 15 minutes per IP
  - Auth endpoints: 20 requests per 15 minutes per IP
- **Input Validation**: All requests validated with express-validator
- **Error Handling**: Structured error responses, no stack traces in production
- **Password Never Exposed**: `select: false` on schema + `toJSON` transform
- **Soft Deletes**: Users are deactivated, not destroyed — preserving audit data
- **Refresh Token Rotation**: Old tokens revoked on each refresh to prevent replay attacks

---

## License

This project is open source and available under the [MIT License](LICENSE).
