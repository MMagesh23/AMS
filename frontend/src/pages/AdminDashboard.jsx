import React from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  User,
  BookOpen,
  ClipboardList,
  LogOut,
} from "lucide-react";

const AdminDashboard = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/admin/login");
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-lg hidden md:flex flex-col p-6">
        <h1 className="text-3xl font-bold text-blue-600 mb-10">Admin Panel</h1>
        <nav className="flex flex-col gap-6 text-gray-700 font-medium">
          <Link to="/admin/dashboard" className="flex items-center gap-3 hover:text-blue-600">
            <LayoutDashboard size={20} /> Dashboard
          </Link>
          <Link to="/admin/students" className="flex items-center gap-3 hover:text-blue-600">
            <Users size={20} /> Students
          </Link>
          <Link to="/admin/teachers" className="flex items-center gap-3 hover:text-blue-600">
            <User size={20} /> Teachers
          </Link>
          <Link to="/admin/class-management" className="flex items-center gap-3 hover:text-blue-600">
            <BookOpen size={20} /> Classes
          </Link>
          <Link to="/admin/attendance" className="flex items-center gap-3 hover:text-blue-600">
            <ClipboardList size={20} /> Attendance
          </Link>
        </nav>

        <button
          onClick={handleLogout}
          className="mt-auto flex items-center gap-2 text-red-500 hover:text-red-700 font-medium"
        >
          <LogOut size={20} /> Logout
        </button>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Bar */}
        <header className="bg-white shadow px-6 py-4 flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-800">Welcome, Admin 👋</h2>
          <button
            onClick={handleLogout}
            className="md:hidden flex items-center gap-2 text-red-500 hover:text-red-700"
          >
            <LogOut size={18} /> Logout
          </button>
        </header>

        {/* Dashboard Grid */}
        <main className="p-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <Link to="/admin/students">
            <div className="bg-white p-6 rounded-xl shadow hover:shadow-md transition hover:-translate-y-1">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold text-gray-800">Students</h3>
                <Users className="text-blue-500" />
              </div>
              <p className="text-sm text-gray-600">Manage student records and assignments.</p>
            </div>
          </Link>

          <Link to="/admin/teachers">
            <div className="bg-white p-6 rounded-xl shadow hover:shadow-md transition hover:-translate-y-1">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold text-gray-800">Teachers</h3>
                <User className="text-purple-500" />
              </div>
              <p className="text-sm text-gray-600">Manage teacher accounts and roles.</p>
            </div>
          </Link>

          <Link to="/admin/class-management">
            <div className="bg-white p-6 rounded-xl shadow hover:shadow-md transition hover:-translate-y-1">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold text-gray-800">Classes</h3>
                <BookOpen className="text-green-500" />
              </div>
              <p className="text-sm text-gray-600">Create and assign students & teachers.</p>
            </div>
          </Link>

          <Link to="/admin/attendance">
            <div className="bg-white p-6 rounded-xl shadow hover:shadow-md transition hover:-translate-y-1">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold text-gray-800">Attendance</h3>
                <ClipboardList className="text-red-500" />
              </div>
              <p className="text-sm text-gray-600">Track and review daily attendance logs.</p>
            </div>
          </Link>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
