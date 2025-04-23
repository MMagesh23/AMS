// Pages/ClassManagement.jsx
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  BookOpen,
  PlusCircle,
  UserPlus,
  Users,
} from 'lucide-react';

const ClassManagement = () => {
  const navigate = useNavigate();

  const sections = [
    {
      title: 'View Classes',
      description: 'Browse all existing classes and their assigned teachers.',
      icon: <BookOpen className="w-8 h-8 text-indigo-600" />,
      action: () => navigate('/admin/class-management/view'),
      bg: 'bg-indigo-50',
    },
    {
      title: 'Create New Class',
      description: 'Add a new class and select its category.',
      icon: <PlusCircle className="w-8 h-8 text-green-600" />,
      action: () => navigate('/admin/class-management/create'),
      bg: 'bg-green-50',
    },
    {
      title: 'Assign Teacher to Class',
      description: 'Link a teacher to a specific class.',
      icon: <UserPlus className="w-8 h-8 text-yellow-600" />,
      action: () => navigate('/admin/class-management/assign-teacher'),
      bg: 'bg-yellow-50',
    },
    {
      title: 'Allocate Students to Class',
      description: 'Assign students into a class group.',
      icon: <Users className="w-8 h-8 text-pink-600" />,
      action: () => navigate('/admin/class-management/allocate-students'),
      bg: 'bg-pink-50',
    },
  ];

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">📚 Class Management</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {sections.map((sec, idx) => (
          <motion.div
            key={idx}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            onClick={sec.action}
            className={`${sec.bg} cursor-pointer rounded-2xl shadow-md p-6 flex items-start space-x-4 hover:shadow-xl transition duration-300`}
          >
            <div className="p-3 bg-white rounded-full shadow">
              {sec.icon}
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-800">{sec.title}</h2>
              <p className="text-sm text-gray-600 mt-1">{sec.description}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default ClassManagement;
