# 🏥 MediBook — Doctor Appointment Booking (MERN)

A full-stack MERN application for booking doctor appointments with role-based access for **Patients**, **Doctors**, and **Admins**.

---

## ✨ Features

### 👤 Patient
- Register/Login
- Browse & search doctors (filter by specialty, sort by rating/price)
- Book appointments with time slot selection
- View, track & cancel own appointments
- Dashboard with appointment statistics

### 👨‍⚕️ Doctor
- Register with professional profile
- Accept or reject patient bookings with notes
- Mark appointments as completed
- Update own profile (specialization, fees, bio, etc.)
- Dashboard with booking overview

### 🔐 Admin
- Approve or reject new doctor registrations
- Manage all doctors, patients, appointments
- Full data overview and statistics

---

## 🛠 Tech Stack

| Layer     | Technology |
|-----------|-----------|
| Frontend  | React 18, React Router v6, Axios |
| Backend   | Node.js, Express.js |
| Database  | MongoDB with Mongoose |
| Auth      | JWT (30-day tokens) + bcryptjs |
| Styling   | Custom CSS (no UI library) — pastel theme |
| Fonts     | Lora (display) + Nunito (body) |

---

## 🚀 Quick Start

### Prerequisites
- Node.js ≥ 18
- MongoDB running locally (or MongoDB Atlas URI)

---

### 1. Clone & install

```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

### 2. Configure environment

The `backend/.env` file is pre-configured for local development:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/medibook
JWT_SECRET=medibook_super_secret_jwt_key_2024
NODE_ENV=development
```

Change `MONGO_URI` to your Atlas connection string for production.

---

### 3. Seed demo data

```bash
cd backend
node seed.js
```

This creates:

| Role    | Email                  | Password     |
|---------|------------------------|--------------|
| Admin   | admin@medibook.com     | Admin@123    |
| Doctor  | sarah@medibook.com     | Doctor@123   |
| Doctor  | james@medibook.com     | Doctor@123   |
| Doctor  | priya@medibook.com     | Doctor@123   |
| Doctor  | marco@medibook.com     | Doctor@123   |
| Doctor  | aisha@medibook.com     | Doctor@123   |
| Doctor  | lucas@medibook.com     | Doctor@123   |
| Patient | patient@medibook.com   | Patient@123  |

---

### 4. Run the app

```bash
# Terminal 1 — Backend
cd backend
npm run dev      # uses nodemon

# Terminal 2 — Frontend
cd frontend
npm start        # starts on http://localhost:3000
```

---

## 📁 Project Structure

```
medibook/
├── backend/
│   ├── models/
│   │   ├── User.js          # Patient, Doctor, Admin
│   │   ├── Doctor.js        # Doctor profile (linked to User)
│   │   └── Appointment.js   # Booking records
│   ├── routes/
│   │   ├── auth.js          # Register, Login, Profile
│   │   ├── doctors.js       # Doctor listing & profiles
│   │   ├── appointments.js  # Book, view, update status
│   │   └── admin.js         # Admin management routes
│   ├── middleware/
│   │   └── auth.js          # JWT protect + role guards
│   ├── server.js
│   ├── seed.js              # Demo data seeder
│   └── .env
│
└── frontend/
    └── src/
        ├── context/
        │   └── AuthContext.js   # Auth state + Axios instance
        ├── components/
        │   ├── Navbar.js
        │   ├── Footer.js
        │   ├── DoctorCard.js
        │   └── Toast.js         # Global toast notifications
        ├── pages/
        │   ├── Home.js
        │   ├── Login.js
        │   ├── Register.js
        │   ├── Doctors.js
        │   ├── BookAppointment.js
        │   ├── PatientDashboard.js
        │   ├── DoctorDashboard.js
        │   └── AdminDashboard.js
        ├── index.css            # Full design system
        ├── App.js               # Router + protected routes
        └── index.js
```

---

## 🔌 API Endpoints

### Auth `/api/auth`
| Method | Endpoint       | Description         | Access |
|--------|---------------|---------------------|--------|
| POST   | /register      | Create account      | Public |
| POST   | /login         | Sign in             | Public |
| GET    | /profile       | Get own profile     | Protected |
| PUT    | /profile       | Update profile      | Protected |
| POST   | /seed-admin    | Create default admin| Dev only |

### Doctors `/api/doctors`
| Method | Endpoint            | Description            | Access |
|--------|---------------------|------------------------|--------|
| GET    | /                   | List approved doctors   | Public |
| GET    | /specializations    | Distinct spec list      | Public |
| GET    | /:id                | Single doctor           | Public |
| GET    | /me                 | Own doctor profile      | Doctor |
| PUT    | /me                 | Update own profile      | Doctor |

### Appointments `/api/appointments`
| Method | Endpoint           | Description              | Access |
|--------|--------------------|--------------------------|--------|
| POST   | /                  | Book appointment          | Patient |
| GET    | /patient           | Patient's appointments    | Patient |
| GET    | /doctor            | Doctor's appointments     | Doctor |
| PUT    | /:id/status        | Approve/reject/complete   | Doctor |
| PUT    | /:id/cancel        | Cancel booking            | Patient |

### Admin `/api/admin`
| Method | Endpoint               | Description           | Access |
|--------|------------------------|-----------------------|--------|
| GET    | /stats                 | Platform statistics   | Admin |
| GET    | /users                 | All patients          | Admin |
| GET    | /doctors               | All doctors           | Admin |
| PUT    | /doctors/:id/approve   | Approve/revoke        | Admin |
| DELETE | /doctors/:id           | Delete doctor         | Admin |
| DELETE | /users/:id             | Delete user           | Admin |
| GET    | /appointments          | All appointments      | Admin |

---

## 🎨 Design

- **Font pairing**: Lora (serif, display) + Nunito (rounded sans-serif)
- **Color palette**: Soft teal (#2a9490), rose, sage green, sky blue — all pastel tones
- **No dark mode** — pure light pastel aesthetic throughout
- **Responsive**: Mobile-first with CSS Grid and media queries
- **No UI framework** — custom CSS design system in `index.css`

---

## 🚢 Deployment Notes

**Backend** (Render / Railway / Heroku):
1. Set `MONGO_URI` to your Atlas connection string
2. Set `JWT_SECRET` to a secure random string
3. Set `NODE_ENV=production`

**Frontend** (Vercel / Netlify):
1. Set `REACT_APP_API_URL=https://your-backend.com/api`
2. Build: `npm run build`
3. Set redirect rules: all routes → `index.html`
