import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import HomePage from "./components/Home";

// Auth
import AdminRegister from './pages/AdminRegister';
import LoginAdmin from './pages/LoginAdmin';
import LoginTeacher from './pages/LoginTeacher';
import ProtectedRoute from './components/ProtectedRoute';


// Class management
import ClassList from './pages/ClassList';
import ClassDetail from './pages/ClassDetail';
import AssignTeacher from './pages/AssignTeacher';

// Dashboard
import AdminDashboard from './pages/AdminDashboard';
import TimeWindowManagement  from './pages/TimeWindowManagement'
import TeacherDashboard from './pages/TeacherDashboard';

// Students Management
import AddStudent from './pages/AddStudent';
import StudentList from './pages/StudentList';
import EditStudent from './pages/EditStudent';
import DeleteStudent from './pages/DeleteStudent';
import AttendanceManagement from './pages/AttendanceManagement'

// Teachers Management
import TeachersList from './pages/TeachersList'
import AddTeacher from './pages/AddTeacher';
import EditTeacher from './pages/EditTeacher';
import TeacherAttendance from './pages/TeacherAttendance';


// VolunteerList Management
import VolunteerList from './pages/VolunteerList';
import AddVolunteer from './pages/AddVolunteer';
import EditVolunteer from './pages/EditVolunteer';
import VolunteerAttendance from './pages/VolunteerAttendance';

// Not found
import NotFound from './pages/NotFound';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/admin-login" element={<LoginAdmin />} />
        <Route path="/admin-register" element={<AdminRegister />} />
        <Route path="/login" element={<LoginTeacher />} />


        {/* Teacher dashboard */}
        <Route path="/teacher/dashboard" element={<ProtectedRoute role="teacher"><TeacherDashboard /></ProtectedRoute>} />
        

        {/* Protected admin route */}
        <Route path="/admin/dashboard" element={<ProtectedRoute role="admin"><AdminDashboard /></ProtectedRoute>} />
        <Route path="/admin/time-window" element={<ProtectedRoute role="admin"><TimeWindowManagement  /></ProtectedRoute>} />


        <Route path="/admin/students" element={<ProtectedRoute role="admin"><StudentList /></ProtectedRoute>} />
        <Route path="/admin/students/add" element={<ProtectedRoute role="admin"><AddStudent /></ProtectedRoute>} />
        <Route path="/admin/students/edit/:id" element={<ProtectedRoute role="admin"><EditStudent /></ProtectedRoute>} />
        <Route path="/admin/students/delete/:id" element={<ProtectedRoute role="admin"><DeleteStudent /></ProtectedRoute>} />

        <Route path="/admin/classes/view" element={<ProtectedRoute role="admin"><ClassList /></ProtectedRoute>} />
        <Route path="/admin/class-management/class/:id" element={<ProtectedRoute role="admin"><ClassDetail /></ProtectedRoute>} />
        <Route path="/admin/class-management/assign-teacher" element={<ProtectedRoute role="admin"><AssignTeacher /></ProtectedRoute>} />

        <Route path="/admin/attendance" element={<ProtectedRoute role="admin"><AttendanceManagement /></ProtectedRoute>} />

        <Route path="/admin/teachers" element={<ProtectedRoute role="admin"><TeachersList /></ProtectedRoute>} />
        <Route path="/admin/teachers/add" element={<ProtectedRoute role="admin"><AddTeacher /></ProtectedRoute>} />
        <Route path="/admin/teachers/edit/:id" element={<ProtectedRoute role="admin"><EditTeacher /></ProtectedRoute>} />
        <Route path="/admin/teachers/attendance" element={<ProtectedRoute role="admin"><TeacherAttendance /></ProtectedRoute>} />;

        <Route path="/admin/volunteers" element={<ProtectedRoute role="admin"><VolunteerList /></ProtectedRoute>} />
        <Route path="/admin/volunteers/add" element={<ProtectedRoute role="admin"><AddVolunteer /></ProtectedRoute>} />
        <Route path="/admin/volunteers/edit/:id" element={<ProtectedRoute role="admin"><EditVolunteer /></ProtectedRoute>} />
        <Route path="/admin/volunteers/attendance" element={<ProtectedRoute role="admin"><VolunteerAttendance /></ProtectedRoute>} />

        
        {/* Not Found */}
        <Route path="*" element={<NotFound />} /> 
      </Routes>
    </Router>
  );
};

export default App;
