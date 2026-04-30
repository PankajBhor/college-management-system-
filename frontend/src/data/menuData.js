// Role-based menu configuration
export const menuConfig = {
  PRINCIPAL: [
    { icon: '📊', label: 'Dashboard', page: 'dashboard' },
    // { icon: '👥', label: 'Students', page: 'students' },
    // { icon: '💰', label: 'Fees', page: 'fees' },
    // { icon: '📚', label: 'Courses', page: 'courses' },
    { icon: '🎓', label: 'Admissions', page: 'admissions' },
    { icon: '📞', label: 'Enquiries', page: 'enquiries' }
  ],
  OFFICE_STAFF: [
    { icon: '📊', label: 'Dashboard', page: 'dashboard' },
    // { icon: '👥', label: 'Students', page: 'students' },
    // { icon: '💰', label: 'Fees', page: 'fees' },
    { icon: '📋', label: 'Admissions', page: 'admissions' }
  ],
  ENQUIRY_STAFF: [
    { icon: '📊', label: 'Dashboard', page: 'dashboard' },
    { icon: '📞', label: 'Enquiries', page: 'enquiries' },
    { icon: '📋', label: 'New Enquiry', page: 'new-enquiry' }
  ],
  FACULTY: [
    { icon: '📊', label: 'Dashboard', page: 'dashboard' },
    { icon: '👥', label: 'Students', page: 'students' },
    { icon: '📚', label: 'Courses', page: 'courses' }
  ],
  HOD: [
    { icon: '📊', label: 'Dashboard', page: 'dashboard' },
    { icon: '👥', label: 'Students', page: 'students' },
    { icon: '📚', label: 'Courses', page: 'courses' },
    { icon: '👨‍💼', label: 'Department', page: 'department' }
  ]
};


