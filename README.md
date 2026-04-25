<div align="center">

# 🏥 Clinic Connect

### A Coordinated Healthcare Management Platform

**Clinic Connect** is a full-stack web application that unifies patients, doctors, pharmacists, lab technicians, and administrators under a single digital healthcare ecosystem — streamlining every step from booking an appointment to receiving a lab result.

[![React](https://img.shields.io/badge/React-19-61DAFB?style=flat&logo=react)](https://react.dev/)
[![Node.js](https://img.shields.io/badge/Node.js-Express-339933?style=flat&logo=node.js)](https://nodejs.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Neon-4169E1?style=flat&logo=postgresql)](https://neon.tech/)
[![Socket.io](https://img.shields.io/badge/Socket.io-Real--time-010101?style=flat&logo=socket.io)](https://socket.io/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-38B2AC?style=flat&logo=tailwind-css)](https://tailwindcss.com/)

</div>

---

## 📋 Table of Contents

- [Overview](#-overview)
- [User Roles](#-user-roles)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [Environment Variables](#-environment-variables)
- [API Reference](#-api-reference)
- [Real-Time Communication](#-real-time-communication)
- [Contributing](#-contributing)

---

## 🌐 Overview

Healthcare fragmentation is a common problem — patients juggle separate portals for appointments, prescriptions, and lab results. **Clinic Connect** solves this by providing a unified platform where every stakeholder in the care journey — patients, doctors, pharmacists, and lab technicians — operates in the same connected environment.

The system handles the full medical workflow:

> **Book appointment → Doctor consults → Issues prescription → Pharmacy fulfills → Lab test ordered → Results uploaded → Patient notified**

All of this happens in real time, with Socket.io powering instant notifications and chat between users.

---

## 👥 User Roles

Clinic Connect supports five distinct roles, each with a dedicated dashboard and tailored feature set:

| Role                  | Description                                                                                     |
| --------------------- | ----------------------------------------------------------------------------------------------- |
| 🛡️ **Admin**          | Full system oversight — manages users, medications, lab exams, and generates reports            |
| 🧑‍⚕️ **Patient**        | Books appointments, views prescriptions & lab results, orders medications, chats with providers |
| 👨‍⚕️ **Doctor**         | Manages patients, conducts appointments, issues prescriptions, requests lab tests               |
| 💊 **Pharmacist**     | Verifies prescriptions, manages medicine inventory, fulfills patient orders                     |
| 🔬 **Lab Technician** | Handles incoming lab test requests, uploads results, manages lab inventory                      |

---

## ✨ Features

### 🔐 Authentication & Security

- JWT-based authentication with 90-day token expiry
- Password hashing with `bcryptjs`
- Secure HTTP-only cookie support
- Email-based password reset via Nodemailer and Mailtrap
- Role-based access control across all routes

### 📅 Appointment Management

- Patients can browse available doctors and book appointments
- Doctors manage their shift schedules through a weekly calendar view
- Automated appointment status updates via cron jobs (`node-cron`)
- Appointment tracking with real-time status changes (pending → confirmed → completed)

### 💊 Prescription System

- Doctors issue digital prescriptions directly from patient profiles
- Prescriptions are linked to the patient's medical record
- Pharmacists receive and verify prescriptions before fulfillment
- Patients can view full prescription history and details

### 🔬 Lab Testing

- Doctors request lab tests for specific patients
- Lab technicians see incoming requests, process tests, and upload results
- Patients can browse available labs, order tests, and view results from their dashboard
- Lab inventory management for available test types

### 🛒 Medicine Orders

- Patients can browse pharmacies and available medications
- Order panel with multi-item cart support
- Pharmacists fulfill orders and update inventory
- Order history is maintained on the patient profile

### 📁 Medical Records

- Doctors maintain structured medical records per patient
- Records are accessible to the patient from their dashboard
- Full history of visits, diagnoses, and notes

### 💬 Real-Time Messaging & Notifications

- In-app chat between patients and healthcare providers using Socket.io
- Instant push notifications for appointment updates, lab results, and order statuses
- Notification history panel accessible from any page

### 🖼️ Media & File Management

- Profile photo uploads powered by Cloudinary
- Image processing and resizing via `sharp`
- `multer` handles file upload middleware

### 🛠️ Admin Dashboard

- User management — create, view, and manage all system users
- Medication catalog management — add and update available medications
- Lab examination catalog management
- System-wide reports and analytics
- Admin profile management

---

## 🧰 Tech Stack

### Frontend

| Technology               | Purpose                           |
| ------------------------ | --------------------------------- |
| **React 19**             | UI framework                      |
| **React Router v6**      | Client-side routing               |
| **Tailwind CSS v4**      | Utility-first styling             |
| **MUI (Material UI v7)** | Component library & date pickers  |
| **Axios**                | HTTP client for API communication |
| **Socket.io Client**     | Real-time WebSocket connection    |
| **Sonner**               | Toast notifications               |
| **Lucide React**         | Icon library                      |
| **Vite**                 | Build tool and dev server         |

### Backend

| Technology              | Purpose                               |
| ----------------------- | ------------------------------------- |
| **Node.js + Express 5** | Server framework                      |
| **PostgreSQL (Neon)**   | Relational database (cloud-hosted)    |
| **Socket.io**           | Real-time bidirectional communication |
| **JSON Web Token**      | Authentication                        |
| **bcryptjs**            | Password hashing                      |
| **Cloudinary**          | Cloud media storage                   |
| **Multer + Sharp**      | File upload and image processing      |
| **Nodemailer**          | Transactional email                   |
| **node-cron**           | Scheduled background jobs             |
| **Pug**                 | Email template rendering              |

---

## 📁 Project Structure

```
Clinic-Connect/
│
├── backend/
│   ├── controllers/          # Business logic for each domain
│   │   ├── authController.js
│   │   ├── appointmentController.js
│   │   ├── usersController.js
│   │   ├── prescriptionController.js
│   │   ├── labResultController.js
│   │   ├── medicineOrderController.js
│   │   └── ...
│   ├── routes/               # API route definitions
│   ├── models/               # Database models
│   ├── jobs/                 # Scheduled cron jobs
│   │   ├── appointmentStatusJob.js
│   │   └── usersStatusJob.js
│   ├── utils/                # Shared utilities
│   │   ├── appError.js
│   │   ├── catchAsync.js
│   │   ├── cloudinary.js
│   │   ├── email.js
│   │   ├── notify.js
│   │   └── socketEvents.js
│   ├── views/                # Pug email templates
│   ├── app.js                # Express app setup
│   ├── server.js             # HTTP server + Socket.io
│   └── config.env            # ⚠️ LOCAL ONLY — never commit this file
│
└── frontend/
    └── clinic-connect/
        ├── public/           # Static assets
        └── src/
            ├── Pages/        # Top-level route pages
            │   ├── Admin Pages/
            │   ├── HomePage.jsx
            │   ├── Login.jsx
            │   ├── SignUp.jsx
            │   ├── Orders.jsx
            │   └── ...
            ├── Components/   # Reusable UI components
            │   ├── Admin Components/
            │   ├── Doctor's components/
            │   ├── Patient's Components/
            │   ├── Pharmacist components/
            │   └── Lab Technician Components/
            ├── Context/      # React context providers (state management)
            ├── Hooks/        # Custom React hooks
            ├── Style/        # CSS Modules
            └── App.jsx       # Root component with all routes
```

---

## 🚀 Getting Started

### Prerequisites

Make sure you have the following installed:

- [Node.js](https://nodejs.org/) v18 or higher
- [npm](https://www.npmjs.com/) v9 or higher
- A PostgreSQL database (the project uses [Neon](https://neon.tech/) — a serverless Postgres cloud service)

### Installation

**1. Clone the repository**

```bash
git clone https://github.com/your-username/clinic-connect.git
cd clinic-connect
```

**2. Set up the Backend**

```bash
cd backend
npm install
```

Copy the environment template and fill in your own values (see [Environment Variables](#-environment-variables) below):

```bash
cp config.env.example config.env
```

Start the backend server:

```bash
# Development (with auto-restart via nodemon)
npm run dev

# Production
npm start
```

The backend will run on `http://localhost:5000` by default.

**3. Set up the Frontend**

```bash
cd ../frontend/clinic-connect
npm install
npm run dev
```

The frontend will run on `http://localhost:5173` by default.

---

## 🔑 Environment Variables


Create a `config.env` file inside the `backend/` directory based on the template below. Replace every placeholder value with your own credentials:

```env
# ──────────────────────────────────────────
# Database
# ──────────────────────────────────────────
# Your Neon (or any PostgreSQL) connection string
DATABASE_URL=postgresql://<user>:<password>@<host>/<dbname>?sslmode=require

# ──────────────────────────────────────────
# Server
# ──────────────────────────────────────────
PORT=5000
NODE_ENV=development

# ──────────────────────────────────────────
# JWT Authentication
# ──────────────────────────────────────────
# Use a long, random string — generate one with:
#   node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
JWT_SECRET=replace_with_a_long_random_secret
JWT_EXPIRES_IN=90d
JWT_COOKIE_EXPIRES_IN=90

# ──────────────────────────────────────────
# Email (Nodemailer)
# Development: use Mailtrap (https://mailtrap.io)
# Production:  replace with your real SMTP provider
# ──────────────────────────────────────────
EMAIL_HOST=sandbox.smtp.mailtrap.io
EMAIL_PORT=587
EMAIL_USERNAME=your_mailtrap_username
EMAIL_PASSWORD=your_mailtrap_password
EMAIL_FROM=Clinic Connect <no-reply@yourdomain.com>

# ──────────────────────────────────────────
# Cloudinary (Image / File Storage)
# https://cloudinary.com/console
# ──────────────────────────────────────────
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### Where to get each credential

| Variable       | Where to find it                                                                             |
| -------------- | -------------------------------------------------------------------------------------------- |
| `DATABASE_URL` | [Neon Console](https://console.neon.tech/) → your project → Connection string                |
| `JWT_SECRET`   | Generate locally: `node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"` |
| `EMAIL_*`      | [Mailtrap](https://mailtrap.io/) → Inboxes → SMTP Settings (for development)                 |
| `CLOUDINARY_*` | [Cloudinary Console](https://cloudinary.com/console) → Dashboard                             |

### Confirm `config.env` is gitignored

Run this before your first push to make sure the file is never tracked:

```bash
git check-ignore -v backend/config.env
```

If the command prints nothing, add the following line to your `.gitignore`:

```
backend/config.env
```

---

## 🔌 Real-Time Communication

Clinic Connect uses **Socket.io** for all real-time features. On connection, each authenticated user joins a private room identified by their `national_id`, allowing targeted message and notification delivery.

**Key socket events:**

| Event               | Direction       | Description                                      |
| ------------------- | --------------- | ------------------------------------------------ |
| `register`          | Client → Server | User registers to their personal room upon login |
| `disconnect`        | Client → Server | Cleans up the room on logout or tab close        |
| Appointment updates | Server → Client | Pushed automatically on status change            |
| New messages        | Server → Client | Delivered to the recipient's private room        |
| Lab result uploads  | Server → Client | Notifies patient when results are ready          |

The `io` instance is exposed globally (`global.io`) so any controller can push events server-side without importing socket logic directly.

---

## 🤝 Contributing

Contributions are welcome! To get started:

1. Fork the repository
2. Create a new branch: `git checkout -b feature/your-feature-name`
3. Make your changes and commit: `git commit -m "feat: add your feature"`
4. Push to your branch: `git push origin feature/your-feature-name`
5. Open a Pull Request

Please follow the existing code style (ESLint + Prettier are configured for the backend).

---

<div align="center">

Made with ❤️ by the Clinic Connect Team

</div>
