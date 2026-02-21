// Role-based menu configuration
export const menuConfig = {
  PRINCIPAL: [
    { icon: '📊', label: 'Dashboard', page: 'dashboard' },
    { icon: '👥', label: 'Students', page: 'students' },
    { icon: '💰', label: 'Fees', page: 'fees' },
    { icon: '📚', label: 'Courses', page: 'courses' },
    { icon: '📞', label: 'Enquiries', page: 'enquiries' }
  ],
  OFFICE_STAFF: [
    { icon: '📊', label: 'Dashboard', page: 'dashboard' },
    { icon: '👥', label: 'Students', page: 'students' },
    { icon: '💰', label: 'Fees', page: 'fees' },
    { icon: '📞', label: 'Enquiries', page: 'enquiries' }
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

// Test user accounts
export const testUsers = {
  'principal@college.com': { name: 'Dr. Pankaj Sharma', role: 'PRINCIPAL' },
  'office@college.com': { name: 'Priya Office', role: 'OFFICE_STAFF' },
  'enquiry@college.com': { name: 'Rahul Enquiry', role: 'ENQUIRY_STAFF' },
  'faculty@college.com': { name: 'Prof. Anita', role: 'FACULTY' },
  'hod@college.com': { name: 'Dr. Rajesh HOD', role: 'HOD' }
};

// Backdoor users for quick testing
export const backdoorUsers = {
  'principal': { name: 'Dr. Pankaj Sharma', role: 'PRINCIPAL' },
  'office': { name: 'Priya Office', role: 'OFFICE_STAFF' },
  'enquiry': { name: 'Rahul Enquiry', role: 'ENQUIRY_STAFF' },
  'faculty': { name: 'Prof. Anita', role: 'FACULTY' },
  'hod': { name: 'Dr. Rajesh HOD', role: 'HOD' }
};
