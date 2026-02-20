# 🗓 ExpertBook — Real-Time Expert Session Booking System

A full-stack real-time session booking platform built with **React**, **Node.js**, **Express**, **MongoDB**, and **Socket.io**.

![Tech Stack](https://img.shields.io/badge/React-19-61DAFB?logo=react) ![Node.js](https://img.shields.io/badge/Node.js-Express-339933?logo=node.js) ![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose-47A248?logo=mongodb) ![Socket.io](https://img.shields.io/badge/Socket.io-Realtime-010101?logo=socket.io)

---

## ✨ Features

### 📋 Expert Listing
- Browse experts with name, category, experience, and rating
- **Search** by name
- **Filter** by category (Technology, Business, Health, Design, Education)
- **Pagination** with smooth navigation
- Loading skeletons & error states

### 👤 Expert Detail
- Full expert profile (bio, specializations, stats)
- Available time slots **grouped by date**
- **Real-time slot updates** via Socket.io — slots booked by another user update instantly with flash animation

### 📝 Booking
- Form fields: Name, Email, Phone, Date, Time Slot, Notes
- **Client-side validation** (email, phone, required fields)
- **Server-side validation** with express-validator
- Success modal after booking
- Booked slots are immediately disabled

### 📅 My Bookings
- Search bookings by email
- Color-coded status badges: **Pending** | **Confirmed** | **Completed**

### ⚡ Critical Features
- **Double-Booking Prevention** — Atomic MongoDB `findOneAndUpdate` prevents race conditions
- **Real-Time Updates** — Socket.io broadcasts slot changes to all connected clients
- **Proper Error Handling** — Validation, meaningful error responses, environment variables

---

## 🛠 Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 19 (Vite), React Router, Socket.io Client |
| Backend | Node.js, Express.js |
| Database | MongoDB (Mongoose ODM) |
| Real-time | Socket.io |
| Validation | express-validator |

---

## 📁 Project Structure

```
Session booking system/
├── backend/
│   ├── controllers/
│   │   ├── expertController.js    # Expert listing & detail logic
│   │   └── bookingController.js   # Booking CRUD with double-booking prevention
│   ├── models/
│   │   ├── Expert.js              # Expert schema with embedded slots
│   │   └── Booking.js             # Booking schema with status tracking
│   ├── routes/
│   │   ├── expertRoutes.js        # GET /experts, GET /experts/:id
│   │   └── bookingRoutes.js       # POST/GET/PATCH /bookings
│   ├── server.js                  # Express + Socket.io + MongoDB setup
│   ├── seed.js                    # Database seeding script
│   ├── .env                       # Environment variables
│   └── package.json
│
└── frontend/
    ├── src/
    │   ├── pages/
    │   │   ├── ExpertListing.jsx   # Expert cards grid with search/filter
    │   │   ├── ExpertDetail.jsx    # Expert profile + real-time slots
    │   │   ├── BookingForm.jsx     # Booking form with validation
    │   │   └── MyBookings.jsx      # Bookings list by email
    │   ├── App.jsx                 # Router + Navigation
    │   ├── App.css                 # Complete design system (dark theme)
    │   ├── api.js                  # API client module
    │   ├── socket.js               # Socket.io client singleton
    │   └── main.jsx                # React entry point
    ├── index.html
    ├── vite.config.js
    └── package.json
```

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** (v18+)
- **MongoDB** — either:
  - [MongoDB Community Server](https://www.mongodb.com/try/download/community) installed locally, OR
  - [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) free cloud cluster

### 1. Clone & Install

```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### 2. Configure Environment

Edit `backend/.env`:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/expert-booking
CLIENT_URL=http://localhost:5173
```

> 💡 **Using MongoDB Atlas?** Replace `MONGODB_URI` with your Atlas connection string:
> `mongodb+srv://<username>:<password>@cluster.mongodb.net/expert-booking`

### 3. Seed the Database

```bash
cd backend
npm run seed
```

This creates 12 sample experts across 5 categories with time slots for the next 7 days.

### 4. Start the Application

**Terminal 1 — Backend:**
```bash
cd backend
npm run dev
# Server runs on http://localhost:5000
```

**Terminal 2 — Frontend:**
```bash
cd frontend
npm run dev
# App opens at http://localhost:5173
```

---

## 🔌 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/experts?page=1&limit=6&search=&category=` | List experts (paginated + filterable) |
| `GET` | `/api/experts/:id` | Get single expert with all slots |
| `GET` | `/api/experts/categories/list` | Get all categories |
| `POST` | `/api/bookings` | Create a booking (with race-condition protection) |
| `PATCH` | `/api/bookings/:id/status` | Update booking status |
| `GET` | `/api/bookings?email=` | Get bookings by email |

---

## 🔐 Double-Booking Prevention

The system uses an **atomic MongoDB operation** to prevent race conditions:

```javascript
// Only updates if the slot exists AND is not yet booked
const result = await Expert.findOneAndUpdate(
  {
    _id: expertId,
    availableSlots: {
      $elemMatch: { date, time: timeSlot, isBooked: false }
    }
  },
  { $set: { 'availableSlots.$.isBooked': true } },
  { new: true }
);
// If result is null → slot was already booked by another user
```

Two concurrent requests for the same slot will result in **only one succeeding** — the other receives a `409 Conflict` response.

---

## 📡 Real-Time Architecture

```
Client A (Expert Detail page)  ←→  Socket.io Server  ←→  Client B (Expert Detail page)
                                         ↑
                                   Booking API
                                   (emits event)
```

1. When a user opens an expert's page, they **join a Socket.io room** (`expert_{id}`)
2. When a booking is created via the API, the server **emits `slotBooked`** to all clients in that room
3. All clients **instantly update** the slot to "booked" with a flash animation

---

## 🎨 Design

- Premium dark theme with glassmorphism effects
- Gradient accents and micro-animations
- Responsive layout (mobile-friendly)
- Skeleton loading states
- Inter font from Google Fonts

---

## 📄 License

MIT
