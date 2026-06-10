// Role-based menu configuration
export const menuConfig = {
  ADMIN: [
    { icon: 'DB', label: 'Dashboard', page: 'dashboard' },
    { icon: 'AD', label: 'Admissions', page: 'admissions' },
    { icon: 'EQ', label: 'Enquiries', page: 'enquiries' },
    { icon: 'NE', label: 'New Enquiry', page: 'new-enquiry' },
    { icon: 'UE', label: 'Update Enquiry', page: 'update-enquiry' },
    { icon: 'PA', label: 'Provisional Admission', page: 'provisional-admission' },
    { icon: 'EM', label: 'Email', page: 'email-enquiry' },
    { icon: 'AN', label: 'Analysis', page: 'analysis' },
    { icon: 'HP', label: 'Home Page', page: 'home-page' },
    { icon: 'ST', label: 'Staff/Department', page: 'staff' },
    { icon: 'SU', label: 'Students', page: 'students' },
    { icon: 'CR', label: 'Courses', page: 'courses' },
    { icon: 'FE', label: 'Fees', page: 'fees' }
  ],
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
    { icon: 'PA', label: 'Provisional Admission', page: 'provisional-admission' },
    { icon: 'EM', label: 'Email', page: 'email-admission' },
    { icon: 'AN', label: 'Analysis', page: 'analysis' }
  ],
  ENQUIRY_STAFF: [
    { icon: 'DB', label: 'Dashboard', page: 'dashboard' },
    { icon: 'EQ', label: 'Enquiries', page: 'enquiries' },
    { icon: 'NE', label: 'New Enquiry', page: 'new-enquiry' },
    { icon: 'UE', label: 'Update Enquiry', page: 'update-enquiry' },
    { icon: 'PA', label: 'Provisional Admission', page: 'provisional-admission' },
    { icon: 'EM', label: 'Email', page: 'email-enquiry' },
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

export const pageAccess = Object.freeze({
  enquiries: ['ADMIN', 'PRINCIPAL', 'ENQUIRY_STAFF', 'ACADEMIC_COORDINATOR'],
  'new-enquiry': ['ADMIN', 'PRINCIPAL', 'ENQUIRY_STAFF'],
  'update-enquiry': ['ADMIN', 'PRINCIPAL', 'ENQUIRY_STAFF'],
  'provisional-admission': ['ADMIN', 'PRINCIPAL', 'ENQUIRY_STAFF', 'OFFICE_STAFF'],
  'email-enquiry': ['ADMIN', 'PRINCIPAL', 'ENQUIRY_STAFF'],
  'email-admission': ['ADMIN', 'PRINCIPAL', 'OFFICE_STAFF'],
  'bulk-enquiry-upload': ['ADMIN', 'PRINCIPAL'],
  'bulk-fy-admission-upload': ['ADMIN', 'PRINCIPAL'],
  'bulk-dsy-admission-upload': ['ADMIN', 'PRINCIPAL'],
  dashboard: ['ADMIN', 'PRINCIPAL', 'OFFICE_STAFF', 'ENQUIRY_STAFF', 'FACULTY', 'HOD', 'ACADEMIC_COORDINATOR'],
  students: ['ADMIN', 'PRINCIPAL', 'OFFICE_STAFF', 'FACULTY', 'HOD'],
  fees: ['ADMIN', 'PRINCIPAL', 'OFFICE_STAFF'],
  courses: ['ADMIN', 'PRINCIPAL', 'FACULTY', 'HOD'],
  admissions: ['ADMIN', 'PRINCIPAL', 'OFFICE_STAFF', 'ACADEMIC_COORDINATOR'],
  department: ['HOD'],
  'hod-admissions': ['HOD'],
  'hod-enquiries': ['HOD'],
  analysis: ['ADMIN', 'PRINCIPAL', 'OFFICE_STAFF', 'ENQUIRY_STAFF', 'HOD', 'ACADEMIC_COORDINATOR'],
  'home-page': ['ADMIN'],
  staff: ['ADMIN', 'PRINCIPAL']
});

export const navigationMenuItems = Object.values(menuConfig)
  .flat()
  .filter((item, index, items) => items.findIndex(candidate => candidate.page === item.page) === index);

export const allMenuItems = navigationMenuItems
  .concat([
    { icon: 'BE', label: 'Bulk Enquiry Upload', page: 'bulk-enquiry-upload' },
    { icon: 'BF', label: 'Bulk FY Admission Upload', page: 'bulk-fy-admission-upload' },
    { icon: 'BD', label: 'Bulk DSY Admission Upload', page: 'bulk-dsy-admission-upload' }
  ])
  .filter((item, index, items) => items.findIndex(candidate => candidate.page === item.page) === index);

export const permissionMenuItems = allMenuItems.map(item => {
  const labelOverrides = {
    admissions: 'Admissions (new, edit, admitted list)',
    enquiries: 'Enquiries List',
    'new-enquiry': 'New Enquiry',
    'update-enquiry': 'Update Enquiry',
    'email-enquiry': 'Email - Enquiry Students',
    'email-admission': 'Email - Admitted Students',
    'provisional-admission': 'Provisional Admission',
    'bulk-enquiry-upload': 'Bulk Enquiry Excel Upload',
    'bulk-fy-admission-upload': 'Bulk FY Admission Excel Upload',
    'bulk-dsy-admission-upload': 'Bulk DSY Admission Excel Upload'
  };
  return { ...item, label: labelOverrides[item.page] || item.label };
});

export const parseAccessPages = (accessPages) => {
  if (!accessPages) return null;
  if (Array.isArray(accessPages)) return accessPages;
  return String(accessPages).split(',').map(page => page.trim()).filter(Boolean);
};

export const canAccessPage = (user, page) => {
  if (!user) return false;
  const role = String(user.role || '').trim().toUpperCase();
  if ((pageAccess[page] || []).includes(role)) return true;
  const explicitAccess = parseAccessPages(user.accessPages);
  if (explicitAccess) {
    if (explicitAccess.includes(page)) return true;
    if (explicitAccess.includes('email') && (page === 'email-enquiry' || page === 'email-admission')) return true;
    return false;
  }
  return (pageAccess[page] || []).includes(user.role);
};

