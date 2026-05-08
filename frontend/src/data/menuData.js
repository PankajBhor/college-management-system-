// Role-based menu configuration
export const menuConfig = {
  PRINCIPAL: [
    { icon: 'DB', label: 'Dashboard', page: 'dashboard' },
    { icon: 'AD', label: 'Admissions', page: 'admissions' },
    { icon: 'EQ', label: 'Enquiries', page: 'enquiries' },
    { icon: 'AN', label: 'Analysis', page: 'analysis' },
    { icon: 'ST', label: 'Staff/Department', page: 'staff' }
  ],
  OFFICE_STAFF: [
    { icon: 'DB', label: 'Dashboard', page: 'dashboard' },
    { icon: 'AD', label: 'Admissions', page: 'admissions' },
    { icon: 'AN', label: 'Analysis', page: 'analysis' }
  ],
  ENQUIRY_STAFF: [
    { icon: 'DB', label: 'Dashboard', page: 'dashboard' },
    { icon: 'EQ', label: 'Enquiries', page: 'enquiries' },
    { icon: 'NE', label: 'New Enquiry', page: 'new-enquiry' },
    { icon: 'AN', label: 'Analysis', page: 'analysis' }
  ],
  ACADEMIC_COORDINATOR: [
    { icon: 'DB', label: 'Dashboard', page: 'dashboard' },
    { icon: 'AD', label: 'Admissions', page: 'admissions' },
    { icon: 'EQ', label: 'Enquiries', page: 'enquiries' },
    { icon: 'AN', label: 'Analysis', page: 'analysis' }
  ],
  FACULTY: [
    { icon: 'DB', label: 'Dashboard', page: 'dashboard' },
    { icon: 'ST', label: 'Students', page: 'students' },
    { icon: 'CR', label: 'Courses', page: 'courses' }
  ],
  HOD: [
    { icon: 'DB', label: 'Dashboard', page: 'dashboard' },
    { icon: 'AD', label: 'Admissions', page: 'hod-admissions' },
    { icon: 'EQ', label: 'Enquiries', page: 'hod-enquiries' },
    { icon: 'AN', label: 'Analysis', page: 'analysis' }
  ]
};


