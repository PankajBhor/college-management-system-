import { getAllEnquiries, searchEnquiries } from './enquiryService';
import { admissionService } from './admissionService';
import { getAllFaculty } from './facultyService';
import { getAllBranches } from './lookupService';
import { getAllStudents } from './studentService';

const CARD_COLORS = {
  primary: { color: '#f7f8fa', textColor: '#1a1a1a', accent: '#1e40af' },
  muted: { color: '#f2f4f7', textColor: '#1a1a1a', accent: '#475467' },
  soft: { color: '#eef4f8', textColor: '#1a1a1a', accent: '#0891b2' },
  warm: { color: '#f8f5ee', textColor: '#1a1a1a', accent: '#d97706' },
  success: { color: '#eefbf5', textColor: '#1a1a1a', accent: '#059669' }
};

const toTotal = (data) => {
  if (typeof data?.totalElements === 'number') {
    return data.totalElements;
  }

  if (Array.isArray(data?.content)) {
    return data.content.length;
  }

  if (Array.isArray(data)) {
    return data.length;
  }

  return 0;
};

const countFrom = async (request) => toTotal(await request);

const safeCountFrom = async (request) => {
  try {
    return await countFrom(request);
  } catch (error) {
    console.error('Dashboard metric request failed:', error.message);
    return 0;
  }
};

const stat = (title, value, icon, palette = CARD_COLORS.primary, subtitle) => ({
  title,
  value: String(value),
  icon,
  subtitle,
  ...palette
});

async function buildAdmissionStats() {
  const [
    fyTotal,
    dsyTotal,
    fyPending,
    dsyPending,
    fyApproved,
    dsyApproved
  ] = await Promise.all([
    safeCountFrom(admissionService.getAllFYAdmissions(0, 1)),
    safeCountFrom(admissionService.getAllDSYAdmissions(0, 1)),
    safeCountFrom(admissionService.getFYAdmissionsByStatus('PENDING', 0, 1)),
    safeCountFrom(admissionService.getDSYAdmissionsByStatus('PENDING', 0, 1)),
    safeCountFrom(admissionService.getFYAdmissionsByStatus('APPROVED', 0, 1)),
    safeCountFrom(admissionService.getDSYAdmissionsByStatus('APPROVED', 0, 1))
  ]);

  return {
    fyTotal,
    dsyTotal,
    totalAdmissions: fyTotal + dsyTotal,
    pendingAdmissions: fyPending + dsyPending,
    approvedAdmissions: fyApproved + dsyApproved,
    openAdmissions: Math.max((fyTotal + dsyTotal) - (fyApproved + dsyApproved), 0)
  };
}

async function buildEnquiryStats() {
  const [totalEnquiries, pendingEnquiries, successEnquiries] = await Promise.all([
    safeCountFrom(getAllEnquiries(0, 1)),
    safeCountFrom(searchEnquiries('Pending', 0, 1)),
    safeCountFrom(searchEnquiries('Success', 0, 1))
  ]);

  return {
    totalEnquiries,
    pendingEnquiries,
    successEnquiries,
    successRate: totalEnquiries > 0 ? Math.round((successEnquiries / totalEnquiries) * 100) : 0
  };
}

async function buildAcademicStats() {
  const [facultyCount, branchCount, studentCount] = await Promise.all([
    safeCountFrom(getAllFaculty()),
    safeCountFrom(getAllBranches()),
    safeCountFrom(getAllStudents())
  ]);

  return { facultyCount, branchCount, studentCount };
}

export async function getDashboardMetrics(role) {
  const normalizedRole = role || '';

  if (normalizedRole === 'OFFICE_STAFF') {
    const admissions = await buildAdmissionStats();

    return {
      title: 'Office Dashboard',
      subtitle: 'Admission activity from the database',
      stats: [
        stat('Total Admissions', admissions.totalAdmissions, 'Adm', CARD_COLORS.primary, 'FY and DSY combined'),
        stat('FY Admissions', admissions.fyTotal, 'FY', CARD_COLORS.muted),
        stat('DSY Admissions', admissions.dsyTotal, 'DSY', CARD_COLORS.soft),
        stat('Pending Admissions', admissions.pendingAdmissions, 'Pen', CARD_COLORS.warm),
        stat('Approved Admissions', admissions.approvedAdmissions, 'Ok', CARD_COLORS.success)
      ]
    };
  }

  if (normalizedRole === 'ENQUIRY_STAFF') {
    const enquiries = await buildEnquiryStats();

    return {
      title: 'Enquiry Dashboard',
      subtitle: 'Enquiry activity from the database',
      stats: [
        stat('Total Enquiries', enquiries.totalEnquiries, 'Inq', CARD_COLORS.primary),
        stat('Pending Enquiries', enquiries.pendingEnquiries, 'Pen', CARD_COLORS.warm),
        stat('Success Enquiries', enquiries.successEnquiries, 'Ok', CARD_COLORS.success),
        stat('Success Rate', `${enquiries.successRate}%`, '%', CARD_COLORS.muted)
      ]
    };
  }

  if (normalizedRole === 'PRINCIPAL') {
    const [admissions, enquiries, academics] = await Promise.all([
      buildAdmissionStats(),
      buildEnquiryStats(),
      buildAcademicStats()
    ]);

    return {
      title: 'Principal Dashboard',
      subtitle: 'Institution overview from database records',
      stats: [
        stat('Total Admissions', admissions.totalAdmissions, 'Adm', CARD_COLORS.primary),
        stat('Pending Admissions', admissions.pendingAdmissions, 'Pen', CARD_COLORS.warm),
        stat('Approved Admissions', admissions.approvedAdmissions, 'Ok', CARD_COLORS.success),
        stat('Total Enquiries', enquiries.totalEnquiries, 'Inq', CARD_COLORS.soft),
        stat('Faculty Entries', academics.facultyCount, 'Fac', CARD_COLORS.muted),
        stat('Active Branches', academics.branchCount, 'Br', CARD_COLORS.primary)
      ]
    };
  }

  if (normalizedRole === 'HOD') {
    const academics = await buildAcademicStats();

    return {
      title: 'HOD Dashboard',
      subtitle: 'Academic records from the database',
      stats: [
        stat('Faculty Entries', academics.facultyCount, 'Fac', CARD_COLORS.primary),
        stat('Active Branches', academics.branchCount, 'Br', CARD_COLORS.soft),
        stat('Student Entries', academics.studentCount, 'Stu', CARD_COLORS.muted)
      ]
    };
  }

  if (normalizedRole === 'FACULTY') {
    const academics = await buildAcademicStats();

    return {
      title: 'Faculty Dashboard',
      subtitle: 'Academic records from the database',
      stats: [
        stat('Student Entries', academics.studentCount, 'Stu', CARD_COLORS.primary),
        stat('Active Branches', academics.branchCount, 'Br', CARD_COLORS.soft)
      ]
    };
  }

  return {
    title: 'Dashboard',
    subtitle: 'Database-backed overview',
    stats: []
  };
}

const dashboardService = {
  getDashboardMetrics
};

export default dashboardService;
