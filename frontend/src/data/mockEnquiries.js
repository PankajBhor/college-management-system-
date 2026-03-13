// Mock enquiry data
export const mockEnquiries = [
  {
    id: 1,
    firstName: 'Amit',
    middleName: '',
    lastName: 'Kumar',
    personalMobileNumber: '9876543210',
    guardianMobileNumber: '9876543220',
    email: 'amit@email.com',
    merit: { class10: '85', class12: '88' },
    admissionFor: 'FY',
    location: 'Pune',
    otherLocation: '',
    category: 'General',
    branchesInterested: [
      { branch: 'Computer', priority: 1 },
      { branch: 'IT', priority: 2 }
    ],
    referenceFaculty: 'Prof. Sharma',
    dteRegistrationDone: true,
    enquiryDate: '2024-02-15',
    status: 'Pending'
  },
  {
    id: 2,
    firstName: 'Priya',
    middleName: 'Kumari',
    lastName: 'Singh',
    personalMobileNumber: '9876543211',
    guardianMobileNumber: '9876543221',
    email: 'priya@email.com',
    merit: { class10: '92', class12: '94' },
    admissionFor: 'FY',
    location: 'Mumbai',
    otherLocation: '',
    category: 'OBC',
    branchesInterested: [
      { branch: 'Electrical', priority: 1 },
      { branch: 'E&TC', priority: 2 }
    ],
    referenceFaculty: 'Prof. Desai',
    dteRegistrationDone: false,
    enquiryDate: '2024-02-14',
    status: 'Success'
  },
  {
    id: 3,
    firstName: 'Ravi',
    middleName: '',
    lastName: 'Patel',
    personalMobileNumber: '9876543212',
    guardianMobileNumber: '9876543222',
    email: 'ravi@email.com',
    merit: { class10: '78', class12: '82' },
    admissionFor: 'DSY',
    location: 'Bangalore',
    otherLocation: '',
    category: 'SC',
    branchesInterested: [
      { branch: 'Civil', priority: 1 },
      { branch: 'Mechanical', priority: 2 }
    ],
    referenceFaculty: 'Prof. Kumar',
    dteRegistrationDone: true,
    enquiryDate: '2024-02-13',
    status: 'Pending'
  },
  {
    id: 4,
    firstName: 'Neha',
    middleName: 'Singh',
    lastName: 'Sharma',
    personalMobileNumber: '9876543213',
    guardianMobileNumber: '9876543223',
    email: 'neha@email.com',
    merit: { other: '88' },
    admissionFor: 'FY',
    location: 'Other',
    otherLocation: 'Nagpur',
    category: 'General',
    branchesInterested: [
      { branch: 'IT', priority: 1 }
    ],
    referenceFaculty: 'Prof. Smith',
    dteRegistrationDone: false,
    enquiryDate: '2024-02-12',
    status: 'Pending'
  },
  {
    id: 5,
    firstName: 'Arjun',
    middleName: 'Singh',
    lastName: 'Gupta',
    personalMobileNumber: '9876543214',
    guardianMobileNumber: '9876543224',
    email: 'arjun@email.com',
    merit: { class10: '90', class12: '91' },
    admissionFor: 'FY',
    location: 'Delhi',
    otherLocation: '',
    category: 'ST',
    branchesInterested: [
      { branch: 'Mechanical', priority: 1 },
      { branch: 'Mehatronics', priority: 2 }
    ],
    referenceFaculty: 'Prof. Patel',
    dteRegistrationDone: true,
    enquiryDate: '2024-02-11',
    status: 'Success'
  }
];

// Dropdown options
export const locationOptions = ['Pune', 'Mumbai', 'Bangalore', 'Delhi'];

export const categoryOptions = ['General', 'OBC', 'SC', 'ST'];

export const branchOptions = ['Computer', 'Civil', 'Mechanical', 'E&TC', 'Electrical', 'Mehatronics', 'IT'];

export const admissionForOptions = ['FY', 'DSY'];
