import React, { useState } from "react";
import { LogOut, BarChart2, Users, BookOpen, Menu } from "lucide-react";
import { useNavigate, Link } from "react-router-dom";

const AdminLayout = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/admin-login");
  };

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  return (
    <div className="flex h-screen bg-gray-100 text-gray-800">
      {/* Sidebar */}
      <aside
        className={`${
          isSidebarOpen ? "w-64" : "w-16"
        } bg-white shadow-md flex flex-col justify-between transition-all duration-300 ease-in-out`}
      >
        <div>
          <div className="p-6 text-2xl font-bold text-blue-600">
            {isSidebarOpen ? "Admin Panel" : ""}
          </div>
          <nav className="flex flex-col space-y-2 p-4">
            <Link to="/admin/dashboard" className="flex items-center space-x-2 p-2 rounded hover:bg-blue-50">
              <BarChart2 className="w-5 h-5 text-blue-500" />
              {isSidebarOpen && <span>Dashboard</span>}
            </Link>
            <Link to="/admin/users" className="flex items-center space-x-2 p-2 rounded hover:bg-blue-50">
              <Users className="w-5 h-5 text-blue-500" />
              {isSidebarOpen && <span>Manage Users</span>}
            </Link>
            <Link to="/admin/classes" className="flex items-center space-x-2 p-2 rounded hover:bg-blue-50">
              <BookOpen className="w-5 h-5 text-blue-500" />
              {isSidebarOpen && <span>Manage Classes</span>}
            </Link>
          </nav>
        </div>
        <div className="p-4 border-t">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
          >
            <LogOut className="w-4 h-4" />
            {isSidebarOpen && <span>Logout</span>}
          </button>
        </div>
      </aside>

      {/* Mobile Menu Button */}
      <button
        className="lg:hidden absolute top-4 left-4 text-blue-600"
        onClick={toggleSidebar}
      >
        <Menu className="w-6 h-6" />
      </button>

      {/* Main Content */}
      <main className="flex-1 p-6 overflow-auto">{children}</main>
    </div>
  );
};

export default AdminLayout;
