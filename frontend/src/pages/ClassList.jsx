import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import api from "../utils/api";
import { useNavigate } from "react-router-dom";

const categoryOrder = {
  Beginner: 1,
  Primary: 2,
  Junior: 3,
  Inter: 4,
  Senior: 5,
};

const ClassList = () => {
  const [classes, setClasses] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [newClassName, setNewClassName] = useState("");
  const [newClassCategory, setNewClassCategory] = useState("Beginner");
  const navigate = useNavigate();

  useEffect(() => {
    fetchClasses();
  }, []);

  const fetchClasses = async () => {
    try {
      const res = await api.get("/admin/classes");
      const sorted = res.data.classes.sort((a, b) => {
        const catDiff =
          categoryOrder[a.category] - categoryOrder[b.category];
        return catDiff !== 0
          ? catDiff
          : a.name.localeCompare(b.name, undefined, { numeric: true });
      });
      setClasses(sorted);
    } catch (error) {
      console.error("Error fetching classes:", error);
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

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Class List</h1>
        <button
          onClick={() => setShowModal(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-700 transition"
        >
          + Create Class
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {classes.map((cls) => (
          <motion.div
            key={cls._id}
            onClick={() => handleCardClick(cls._id)}
            whileHover={{ scale: 1.03 }}
            className="cursor-pointer bg-white rounded-2xl shadow p-4 border border-gray-200 hover:shadow-md transition"
          >
            <h2 className="text-xl font-semibold text-gray-800">{cls.name}</h2>
            <p className="text-sm text-gray-500">{cls.category}</p>
          </motion.div>
        ))}
      </div>

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
    </div>
  );
};

export default ClassList;
