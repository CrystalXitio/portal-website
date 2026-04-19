# 🎓 CrystalXitio — Academic Portal

A full-stack, role-based academic management platform for colleges, built with **React + Vite** (frontend) and **Node.js + Express + MongoDB** (backend).

---

## ✨ Features

- **Multi-role authentication** — Student, Teacher, and Admin roles with JWT-secured sessions
- **Student Dashboard** — View attendance, ICA marks, exam results, fees, and timetable
- **Teacher Dashboard** — Manage subject-wise attendance and ICA marks for enrolled students
- **Admin Panel** — Create and manage user accounts across all roles
- **Profile Management** — Edit personal details, upload a profile photo via Cloudinary
- **Help Desk / Tickets** — Submit and track support tickets
- **LOR Tracker** — Request and monitor Letter of Recommendation status
- **Forgot Password** — Email-based OTP password reset via Nodemailer (Gmail)
- **Responsive UI** — Premium flat-design aesthetic with dark/light mode support

---

## 🗂️ Project Structure

```
portal-website/
├── client/          # React + Vite frontend
│   └── src/
│       ├── pages/   # All route-level page components
│       ├── components/
│       ├── context/ # Auth context / global state
│       ├── layouts/
│       └── utils/
├── server/          # Node.js + Express backend
│   ├── controllers/
│   ├── models/      # Mongoose schemas
│   ├── routes/      # API route definitions
│   ├── utils/
│   └── server.js
├── .env.example     # Template for required environment variables
└── package.json     # Root: runs both apps concurrently
```

---

## 🛠️ Tech Stack

| Layer      | Technology                                    |
|------------|-----------------------------------------------|
| Frontend   | React 19, Vite, React Router v7, Lucide Icons |
| Backend    | Node.js, Express 5, Mongoose                  |
| Database   | MongoDB Atlas                                 |
| Auth       | JWT (`jsonwebtoken`), `bcryptjs`              |
| Media      | Cloudinary (profile photo uploads)            |
| Email      | Nodemailer (Gmail App Password)               |
| Dev Tools  | Nodemon, ESLint, Concurrently                 |

---

## 🚀 Getting Started (Local Development)

### Prerequisites
- [Node.js](https://nodejs.org/) v18+
- A [MongoDB Atlas](https://www.mongodb.com/atlas) cluster (free tier works fine)
- A [Cloudinary](https://cloudinary.com/) account (free tier)
- A Gmail account with an [App Password](https://support.google.com/accounts/answer/185833) enabled

### 1. Clone the repo

```bash
git clone https://github.com/CrystalXitio/portal-website.git
cd portal-website
```

### 2. Set up environment variables

```bash
cp .env.example server/.env
```

Open `server/.env` and fill in all the values:

```env
PORT=5000
NODE_ENV=development

MONGO_URI=<your MongoDB Atlas connection string>
DB_NAME=college-portal

JWT_SECRET=<a long random secret>
JWT_EXPIRES_IN=7d

CLOUDINARY_CLOUD_NAME=<your_cloud_name>
CLOUDINARY_API_KEY=<your_api_key>
CLOUDINARY_API_SECRET=<your_api_secret>
CLOUDINARY_URL=cloudinary://<api_key>:<api_secret>@<cloud_name>

MAIL_USER=your_gmail@gmail.com
MAIL_PASS=your_16_char_app_password

CLIENT_ORIGIN=http://localhost:5173
```

### 3. Install all dependencies

From the **root** directory:

```bash
npm install
```

This automatically installs dependencies for both `client/` and `server/` via the `postinstall` script.

### 4. Run the development servers

```bash
npm run dev
```

This uses `concurrently` to start both servers at once:

| Service  | URL                     |
|----------|-------------------------|
| Frontend | http://localhost:5173   |
| Backend  | http://localhost:5000   |

---

## 🌐 Deployment

This project requires a running backend server (Node.js + MongoDB), so it **cannot be hosted on GitHub Pages** (which only supports static files).

### Recommended Free Hosting Options

| Service             | What to host        | Notes                                      |
|---------------------|---------------------|--------------------------------------------|
| [Render](https://render.com) | Backend (Node.js)   | Free tier with automatic deploys           |
| [Vercel](https://vercel.com) | Frontend (React)    | Zero-config Vite deployment                |
| [Railway](https://railway.app) | Backend or full stack | Easy MongoDB + Node.js deployment     |
| [MongoDB Atlas](https://www.mongodb.com/atlas) | Database | Free M0 cluster                  |

#### Quick Deploy to Vercel (Frontend)

1. Set `VITE_API_URL` in Vercel environment variables pointing to your deployed backend URL.
2. Connect your GitHub repo and deploy the `client/` directory.

#### Quick Deploy to Render (Backend)

1. Create a new **Web Service** on Render, pointing to the `server/` directory.
2. Set all environment variables from `.env.example` in the Render dashboard.
3. Set the **Start Command** to `node server.js`.

---

## 📋 API Overview

| Method | Endpoint                        | Description                          | Auth  |
|--------|---------------------------------|--------------------------------------|-------|
| POST   | `/api/auth/login`               | Login and receive a JWT              | ❌    |
| POST   | `/api/auth/signup`              | Register a new user                  | ❌    |
| POST   | `/api/auth/forgot-password`     | Send OTP to email                    | ❌    |
| POST   | `/api/auth/reset-password`      | Reset password with OTP              | ❌    |
| GET    | `/api/user/profile`             | Fetch current user profile           | ✅    |
| PATCH  | `/api/user/profile`             | Update profile details / photo       | ✅    |
| GET    | `/api/academic/subjects`        | Get enrolled subjects                | ✅    |
| GET    | `/api/academic/attendance`      | Get attendance records               | ✅    |
| PATCH  | `/api/academic/attendance`      | Update attendance (Teacher only)     | ✅    |
| GET    | `/api/academic/ica`             | Get ICA marks                        | ✅    |
| PATCH  | `/api/academic/ica`             | Update ICA marks (Teacher only)      | ✅    |
| GET    | `/api/admin/users`              | List all users (Admin only)          | ✅    |
| POST   | `/api/admin/users`              | Create a user (Admin only)           | ✅    |
| DELETE | `/api/admin/users/:id`          | Delete a user (Admin only)           | ✅    |

---

## 🔐 Environment Variables Reference

See [`.env.example`](.env.example) for the full list.

> ⚠️ **Never commit your `server/.env` file.** It is already included in `.gitignore`.

---

## 📄 License

This project is intended for academic/educational use.
