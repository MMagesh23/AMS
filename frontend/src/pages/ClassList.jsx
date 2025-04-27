import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import api from "../utils/api";
import { useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import AdminLayout from "../layouts/AdminLayout";


const categoryOrder = {
  Beginner: 1,
  Primary: 2,
  Junior: 3,
  Inter: 4,
};

const categoryColors = {
  Beginner: "bg-green-100 text-green-800 border-green-300",
  Primary: "bg-blue-100 text-blue-800 border-blue-300",
  Junior: "bg-yellow-100 text-yellow-800 border-yellow-300",
  Inter: "bg-purple-100 text-purple-800 border-purple-300",
};

const ClassList = () => {
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [newClassName, setNewClassName] = useState("");
  const [newClassCategory, setNewClassCategory] = useState("Beginner");
  const [deleteModal, setDeleteModal] = useState({ show: false, classId: null });
  const navigate = useNavigate();

  useEffect(() => {
    fetchClasses();
  }, []);

  const fetchClasses = async () => {
    try {
      setLoading(true);
      const res = await api.get("/admin/classes");
      const sorted = res.data.classes.sort((a, b) => {
        const catDiff = categoryOrder[a.category] - categoryOrder[b.category];
        return catDiff !== 0
          ? catDiff
          : a.name.localeCompare(b.name, undefined, { numeric: true });
      });
      setClasses(sorted);
    } catch (error) {
      console.error("Error fetching classes:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCardClick = (id) => {
    if (!id) return;
    navigate(`/admin/class-management/class/${id}`);
  };

  const handleCreateClass = async () => {
    try {
      await api.post("/admin/classes", {
        name: newClassName,
        category: newClassCategory,
      });
      setNewClassName("");
      setNewClassCategory("Beginner");
      setShowModal(false);
      fetchClasses();
    } catch (error) {
      console.error("Error creating class:", error);
    }
  };

  const handleDeleteClass = async () => {
    try {
      await api.delete(`/admin/classes/${deleteModal.classId}`);
      setDeleteModal({ show: false, classId: null });
      fetchClasses();
    } catch (error) {
      console.error("Error deleting class:", error);
    }
  };

  const groupedClasses = classes.reduce((acc, cls) => {
    acc[cls.category] = acc[cls.category] || [];
    acc[cls.category].push(cls);
    return acc;
  }, {});

  return (
    <AdminLayout>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Class List</h1>
          <button
            onClick={() => setShowModal(true)}
            className="bg-gradient-to-r from-blue-500 to-blue-700 text-white px-4 py-2 rounded-lg shadow hover:from-blue-600 hover:to-blue-800 transition"
          >
            + Create Class
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-40">
            <Loader2 className="animate-spin h-8 w-8 text-blue-600" />
          </div>
        ) : (
          Object.keys(groupedClasses).map((category) => (
            <div key={category} className="mb-8">
              <h2
                className={`text-lg font-bold mb-4 px-4 py-2 rounded-lg border ${categoryColors[category]}`}
              >
                {category}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {groupedClasses[category].map((cls) => (
                  <motion.div
                    key={cls._id}
                    whileHover={{ scale: 1.05 }}
                    className="cursor-pointer bg-white rounded-2xl shadow-lg p-6 border border-gray-200 hover:shadow-xl transition relative"
                  >
                    <h2
                      onClick={() => handleCardClick(cls._id)}
                      className="text-xl font-semibold text-gray-800"
                    >
                      {cls.name}
                    </h2>
                    <button
                      onClick={() => setDeleteModal({ show: true, classId: cls._id })}
                      className="absolute bottom-4 right-4 text-red-600 hover:underline text-sm"
                    >
                      Delete
                    </button>
                  </motion.div>
                ))}
              </div>
            </div>
          ))
        )}

        {/* Create Class Modal */}
        {showModal && (
          <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-white p-6 rounded-2xl shadow-lg w-full max-w-md"
            >
              <h2 className="text-lg font-bold mb-4">Create New Class</h2>
              <div className="mb-3">
                <label className="block text-sm font-medium mb-1">Name</label>
                <input
                  type="text"
                  value={newClassName}
                  onChange={(e) => setNewClassName(e.target.value)}
                  className="w-full border px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Category</label>
                <select
                  value={newClassCategory}
                  onChange={(e) => setNewClassCategory(e.target.value)}
                  className="w-full border px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                >
                  {Object.keys(categoryOrder).map((category) => (
                    <option key={category}>{category}</option>
                  ))}
                </select>
              </div>
              <div className="flex justify-end space-x-2">
                <button
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded-md border"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateClass}
                  className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 transition"
                >
                  Create
                </button>
              </div>
            </motion.div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {deleteModal.show && (
          <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-white p-6 rounded-2xl shadow-lg w-full max-w-md"
            >
              <h2 className="text-lg font-bold mb-4 text-red-600">Confirm Deletion</h2>
              <p className="text-gray-600 mb-6">
                Are you sure you want to delete this class? This action cannot be undone.
              </p>
              <div className="flex justify-end space-x-2">
                <button
                  onClick={() => setDeleteModal({ show: false, classId: null })}
                  className="px-4 py-2 rounded-md border"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteClass}
                  className="px-4 py-2 rounded-md bg-red-600 text-white hover:bg-red-700 transition"
                >
                  Delete
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default ClassList;