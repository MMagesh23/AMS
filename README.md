# VBS-MS (VBS - Management System)

A full-stack attendance management system built with Express.js (backend) and React (frontend) for managing students, teachers, volunteers, classes, and attendance tracking.

---

## 📋 Project Overview

The AMS is a comprehensive application designed to streamline attendance management for educational institutions. It supports multiple user roles (Admin, Teachers), manages students and teachers across different classes, and tracks attendance with flexible time windows.

### Key Features:
- **User Authentication**: Secure login for admins and teachers with JWT tokens
- **Role-Based Access Control**: Different permissions for admin and teacher roles
- **Student Management**: Add, edit, delete, and manage students with grade/category assignments
- **Teacher Management**: Manage teachers and assign them to classes
- **Class Management**: Create and manage classes with student and teacher assignments
- **Attendance Tracking**: Record and manage attendance with date-based tracking
- **Volunteer Management**: Manage volunteer information and attendance
- **Time Window Management**: Admin can set configurable time windows for attendance

---

## 🏗️ Architecture

### Backend Stack
- **Framework**: Express.js 5.1.0
- **Database**: MongoDB with Mongoose ODM 8.13.2
- **Authentication**: JSON Web Tokens (JWT) with jwt-decode
- **Security**: bcryptjs for password hashing
- **Environment**: dotenv for configuration management
- **CORS**: Configured for secure cross-origin requests
- **Date Handling**: moment.js for date manipulation

### Frontend Stack
- **Framework**: React 19.0.0 with Vite (build tool)
- **Styling**: Tailwind CSS 3.4.17
- **HTTP Client**: Axios for API calls
- **Routing**: React Router DOM 7.5.1
- **Date Handling**: date-fns 4.1.0, react-datepicker
- **UI/UX**: 
  - Framer Motion for animations
  - Lucide React & React Icons for icons
  - React Hot Toast for notifications
  - React Toastify for alerts
- **PDF Generation**: jsPDF & jspdf-autotable
- **Particles**: react-tsparticles for visual effects

---

## 📁 Project Structure

### Backend (`/backend`)
```
backend/
├── app.js                 # Express app configuration with CORS setup
├── index.js              # Server entry point & port configuration
├── package.json          # Dependencies & scripts
├── config/
│   └── db.js            # MongoDB connection configuration
├── controllers/
│   ├── authController.js       # Auth logic (register, login, password change)
│   ├── adminController.js      # Admin-specific operations
│   ├── attendanceController.js # Attendance management
│   ├── teacherController.js    # Teacher-specific operations
│   └── studentController.js    # Student management (implied)
├── middleware/
│   ├── authMiddleware.js       # JWT token verification & user extraction
│   └── roleMiddleware.js       # Role-based access control (admin/teacher)
├── models/
│   ├── User.js          # User schema (userID, password, role)
│   ├── Student.js       # Student schema (name, grade, category, classAssigned)
│   ├── Teacher.js       # Teacher information
│   ├── Class.js         # Class schema (name, category, teacher, students)
│   ├── Attendance.js    # Attendance records (date, student, status, classId)
│   ├── TimeWindow.js    # Configurable time windows
│   ├── Volunteer.js     # Volunteer information
│   ├── TeacherAttendance.js  # Teacher attendance tracking
│   └── VolunteerAttendance.js # Volunteer attendance tracking
└── routes/
    ├── authRoutes.js    # Auth endpoints (register, login, change password)
    ├── adminRoutes.js   # Admin endpoints
    └── teacherRoutes.js # Teacher endpoints
```

### Frontend (`/frontend`)
```
frontend/src/
├── App.jsx              # Main routing & route definitions
├── main.jsx            # React DOM render entry point
├── App.css & index.css # Global styles
├── components/
│   ├── Home.jsx        # Landing/home page
│   ├── Navbar.jsx      # Navigation component
│   └── ProtectedRoute.jsx # Route protection based on user role
├── pages/
│   ├── Auth/
│   │   ├── AdminRegister.jsx
│   │   ├── LoginAdmin.jsx
│   │   └── LoginTeacher.jsx
│   ├── Admin Dashboard/
│   │   ├── AdminDashboard.jsx
│   │   └── TimeWindowManagement.jsx
│   ├── Teacher Dashboard/
│   │   └── TeacherDashboard.jsx
│   ├── Student Management/
│   │   ├── StudentList.jsx
│   │   ├── AddStudent.jsx
│   │   ├── EditStudent.jsx & EditStudentModal.jsx
│   │   └── DeleteStudent.jsx
│   ├── Class Management/
│   │   ├── ClassList.jsx
│   │   ├── ClassDetail.jsx
│   │   └── AssignTeacher.jsx
│   ├── Teacher Management/
│   │   ├── TeachersList.jsx
│   │   ├── AddTeacher.jsx
│   │   ├── EditTeacher.jsx
│   │   └── TeacherAttendance.jsx
│   ├── Volunteer Management/
│   │   ├── VolunteerList.jsx
│   │   ├── AddVolunteer.jsx
│   │   ├── EditVolunteer.jsx
│   │   └── VolunteerAttendance.jsx
│   ├── Attendance/
│   │   └── AttendanceManagement.jsx
│   ├── NotFound.jsx    # 404 page
│   └── old/           # Archived/deprecated pages
├── hooks/
│   └── useClassDetail.js # Custom hook for class detail data
├── layouts/
│   └── AdminLayout.jsx   # Layout wrapper for admin pages
├── utils/
│   ├── api.js          # General API utilities & axios instance
│   ├── teacher-api.js  # Teacher-specific API calls
│   ├── auth.js         # Authentication utilities
│   ├── attendanceHelpers.js # Attendance-related helpers
│   └── dateUtils.js    # Date manipulation utilities
└── assets/            # Images, icons, static files
```

---

## 🔐 Authentication & Security

### Authentication Flow:
1. **Registration (Admin only)**: Hidden route `/api/auth/admin-register`
   - Creates admin user with hashed password (bcryptjs)
   - Returns success message

2. **Login**: `/api/auth/login` (for both admin and teacher)
   - Validates credentials against User collection
   - Returns JWT token (expires in 10 hours) and user role

3. **Password Change**: `/api/auth/admin-change-password` (hidden)
   - Updates admin password securely

### Authorization:
- **authMiddleware**: Extracts and verifies JWT from Authorization header
- **roleMiddleware**: Enforces role-based access (admin/teacher)
- **ProtectedRoute** (Frontend): Wraps routes and checks user role before rendering

### CORS Configuration:
- Allows requests from:
  - `http://localhost:5173` (local development)
  - `https://poj-vbs.vercel.app` (production)
- Allows credentials (cookies, auth headers)
- Rejects unauthorized origins

---

## 📊 Data Models

### User
```javascript
{
  userID: String (unique),
  password: String (hashed),
  role: 'admin' | 'teacher'
}
```

### Student
```javascript
{
  name: String,
  grade: Number,
  category: 'Beginner' | 'Primary' | 'Junior' | 'Inter',
  place: String,
  parent: String,
  phone: String,
  classAssigned: ObjectId (ref: Class)
}
```

### Class
```javascript
{
  name: String (e.g., "Beginner A"),
  category: 'Beginner' | 'Primary' | 'Junior' | 'Inter',
  teacher: ObjectId (ref: Teacher),
  students: [ObjectId] (ref: Student)
}
```

### Attendance
```javascript
{
  date: Date,
  day: Number (1-10 mapping),
  student: ObjectId (ref: Student),
  status: 'present' | 'absent',
  submittedBy: ObjectId (ref: Teacher),
  classId: ObjectId (ref: Class)
}
```

Additional models: `Teacher`, `TimeWindow`, `Volunteer`, `TeacherAttendance`, `VolunteerAttendance`

---

## 🚀 Getting Started

### Backend Setup:
```bash
cd backend
npm install
```

Create `.env` file:
```
MONGO_URI=mongodb+srv://your-connection-string
JWT_SECRET=your-secret-key
PORT=5000
```

Run server:
```bash
npm start  # or nodemon for development
```

### Frontend Setup:
```bash
cd frontend
npm install
npm run dev  # Starts Vite dev server on localhost:5173
```

Build for production:
```bash
npm run build
```

---

## 📡 API Routes

### Authentication (`/api/auth`)
- `POST /admin-register` - Register new admin
- `POST /login` - Login (admin/teacher)
- `POST /admin-change-password` - Change admin password

### Admin Routes (`/api/admin`)
- Student management (add, edit, delete, list)
- Teacher management (add, edit, delete, list)
- Class management (create, assign teachers, list)
- Attendance operations
- Time window configuration

### Teacher Routes (`/api/teacher`)
- View assigned class
- Submit student attendance
- View own attendance
- Dashboard data

---

## 🎨 Frontend Features

- **Protected Routes**: Role-based access control with ProtectedRoute component
- **Responsive Design**: Tailwind CSS for mobile-friendly UI
- **Notifications**: Toast notifications for user feedback
- **PDF Export**: Generate attendance reports using jsPDF
- **Real-time Updates**: Axios-based API calls with error handling
- **Dark/Light Support**: Tailwind configuration for theming
- **Custom Hooks**: useClassDetail for efficient data fetching

---

## 🔧 Technologies Used

| Layer | Technology |
|-------|-----------|
| **Backend Runtime** | Node.js + Express.js |
| **Database** | MongoDB + Mongoose |
| **Frontend Framework** | React 19 + React Router |
| **Styling** | Tailwind CSS |
| **Build Tool** | Vite |
| **Authentication** | JWT + bcryptjs |
| **API Client** | Axios |
| **Date Library** | moment.js, date-fns |

---

## 🚢 Deployment

- **Backend**: Vercel (configured via `vercel.json`)
- **Frontend**: Vercel (configured via `vercel.json`)
- Production domain: `https://poj-vbs.vercel.app`

---

## 📝 Notes

- JWT tokens expire in 10 hours
- Attendance records have unique constraint on (date, student) pairs
- Admin registration is a hidden route for security
- Role middleware ensures strict access control
- Frontend components follow React best practices with hooks
