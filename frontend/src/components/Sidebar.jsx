import React from 'react';
import { Link } from 'react-router-dom';

const Sidebar = ({ role, onNavigate }) => {
  const menus = {
    PRINCIPAL: [
      { icon: '👥', label: 'Students', path: '/students' },
      { icon: '💰', label: 'Fees', path: '/fees' },
      { icon: '📚', label: 'Courses', path: '/courses' },
      { icon: '📞', label: 'Enquiries', path: '/enquiries' },
      { icon: '📊', label: 'Reports', path: '/reports' }
    ],
    OFFICE_STAFF: [
      { icon: '👥', label: 'Students', path: '/students' },
      { icon: '💰', label: 'Fees', path: '/fees' },
      { icon: '📞', label: 'Enquiries', path: '/enquiries' }
    ],
    ENQUIRY_STAFF: [
      { icon: '📞', label: 'Enquiries', path: '/enquiries' },
      { icon: '📋', label: 'New Enquiry', path: '/new-enquiry' }
    ],
    FACULTY: [
      { icon: '👥', label: 'Students', path: '/students' },
      { icon: '📚', label: 'Courses', path: '/courses' }
    ]
  };

  const roleMenus = menus[role] || [];

  return (
    <div className="w-64 bg-gradient-to-b from-blue-600 to-blue-800 text-white p-6 h-screen fixed left-0 top-0 overflow-y-auto">
      <div className="mb-8">
        <h2 className="text-2xl font-bold">College Management</h2>
        <p className="text-blue-200 text-sm">{role}</p>
      </div>
      
      <nav className="space-y-2">
        {roleMenus.map((menu, index) => (
          <Link
            key={index}
            to={menu.path}
            onClick={() => onNavigate?.(menu.path)}
            className="flex items-center space-x-3 p-3 bg-white/10 hover:bg-white/20 rounded-lg transition-all duration-200"
          >
            <span className="text-xl">{menu.icon}</span>
            <span>{menu.label}</span>
          </Link>
        ))}
      </nav>
    </div>
  );
};

export default Sidebar;
