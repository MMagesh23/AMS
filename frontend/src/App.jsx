import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import HomePage from "./components/Home";

// Auth
import AdminRegister from './pages/AdminRegister';
import LoginAdmin from './pages/LoginAdmin';
import LoginTeacher from './pages/LoginTeacher';
import ProtectedRoute from './components/ProtectedRoute';


// Class management
import ClassManagement from './pages/ClassManagement';
import ClassList from './pages/ClassList';
import ClassDetail from './pages/ClassDetail';
import CreateClass from './pages/CreateClass';
import AssignTeacher from './pages/AssignTeacher';
import AllocateStudents from './pages/AllocateStudents';

// Dashboard
import AdminDashboard from './pages/AdminDashboard';
import AddTeacher from './pages/AddTeacher';
import AddStudent from './pages/AddStudent';
import StudentList from './pages/StudentList';
import TeachersList from './pages/TeachersList'
import EditStudent from './pages/EditStudent';
import EditTeacher from './pages/EditTeacher';
import DeleteStudent from './pages/DeleteStudent';

import ClassAttendanceView from './pages/ClassAttendanceView';
import NotFound from './pages/NotFound';
import TeacherDashboard from './pages/TeacherDashboard';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/admin-login" element={<LoginAdmin />} />
        <Route path="/admin-register" element={<AdminRegister />} />
        <Route path="/login" element={<LoginTeacher />} />

        <Route path="/teacher/dashboard" element={<ProtectedRoute role="teacher">
          <TeacherDashboard />
        </ProtectedRoute>} />
        {/* Protected admin route */}
        <Route 
          path="/admin/dashboard" 
          element={
            <ProtectedRoute role="admin">
              <AdminDashboard />
            </ProtectedRoute>
          } 
        />
        <Route path="/admin/teachers/add" element={<ProtectedRoute role="admin">
              <AddTeacher />
            </ProtectedRoute>} />

            <Route path="/admin/students/add" element={<ProtectedRoute role="admin">
              <AddStudent />
            </ProtectedRoute>} />

            <Route path="/admin/students" element={<ProtectedRoute role="admin"><StudentList /></ProtectedRoute>} />
            <Route path="/admin/students/edit/:id" element={<ProtectedRoute role="admin"><EditStudent /></ProtectedRoute>} />
            <Route path="/admin/students/delete/:id" element={<ProtectedRoute role="admin"><DeleteStudent /></ProtectedRoute>} />
            <Route path="/admin/teachers/edit/:id" element={<ProtectedRoute role="admin"><EditTeacher /></ProtectedRoute>} />

            <Route path="/admin/class-management" element={<ProtectedRoute role="admin"><ClassManagement /></ProtectedRoute>} />
            <Route path="/admin/class-management/view" element={<ProtectedRoute role="admin"><ClassList /></ProtectedRoute>} />
            <Route path="/admin/class-management/class/:id" element={<ProtectedRoute role="admin"><ClassDetail /></ProtectedRoute>} />
            <Route path="/admin/class-management/create" element={<ProtectedRoute role="admin"><CreateClass /></ProtectedRoute>} />
            <Route path="/admin/class-management/assign-teacher" element={<ProtectedRoute role="admin"><AssignTeacher /></ProtectedRoute>} />
            <Route path="/admin/class-management/allocate-students" element={<ProtectedRoute role="admin"><AllocateStudents /></ProtectedRoute>} />

            <Route path="/admin/teachers" element={<ProtectedRoute role="admin"><TeachersList /></ProtectedRoute>} />

            <Route path="/admin/classes/:classId/attendance" element={<ProtectedRoute role="admin"><ClassAttendanceView /></ProtectedRoute>} />





        <Route path="*" element={<NotFound />} /> 
      </Routes>
    </Router>
  );
};

export default App;
