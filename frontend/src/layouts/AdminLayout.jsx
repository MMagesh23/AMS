import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  User,
  BookOpen,
  Handshake,
  ClipboardList,
  LogOut,
  Menu,
  X,
} from "lucide-react";

const AdminLayout = ({ children }) => {
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/admin-login");
  };

  return (
    <div className="flex h-screen overflow-hidden bg-gray-100">
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-300 md:translate-x-0 md:static md:flex flex-col p-6`}
      >
        <div className="flex justify-between items-center mb-10">
          <h1 className="text-3xl font-bold text-blue-600">Admin Panel</h1>
          <button
            className="md:hidden text-gray-700 hover:text-gray-900"
            onClick={() => setIsSidebarOpen(false)}
          >
            <X size={24} />
          </button>
        </div>
        <nav className="flex flex-col gap-6 text-gray-700 font-medium">
          <Link
            to="/admin/dashboard"
            className="flex items-center gap-3 hover:text-blue-600"
          >
            <LayoutDashboard size={20} /> Dashboard
          </Link>
          <Link
            to="/admin/students"
            className="flex items-center gap-3 hover:text-blue-600"
          >
            <Users size={20} /> Students
          </Link>
          <Link
            to="/admin/teachers"
            className="flex items-center gap-3 hover:text-blue-600"
          >
            <User size={20} /> Teachers
          </Link>
          <Link
            to="/admin/classes/view"
            className="flex items-center gap-3 hover:text-blue-600"
          >
            <BookOpen size={20} /> Classes
          </Link>
          <Link
            to="/admin/volunteers/"
            className="flex items-center gap-3 hover:text-blue-600"
          >
            <Handshake size={20} /> Volunteers
          </Link>
          <Link
            to="/admin/attendance"
            className="flex items-center gap-3 hover:text-blue-600"
          >
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
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <header className="bg-white shadow px-6 py-4 flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-800">Welcome, Admin 👋</h2>
          <button
            className="md:hidden flex items-center gap-2 text-gray-700 hover:text-gray-900"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          >
            <Menu size={24} />
          </button>
        </header>

        {/* Scrollable Content */}
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  );
};

export default AdminLayout;