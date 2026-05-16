import { formatDate } from './formatters';

const parseMerit = (enquiry = {}) => {
  if (enquiry.merit && typeof enquiry.merit === 'object') return enquiry.merit;
  if (!enquiry.meritDetails) return {};
  if (typeof enquiry.meritDetails === 'object') return enquiry.meritDetails;
  try {
    return JSON.parse(enquiry.meritDetails);
  } catch {
    return {};
  }
};

const formatMerit = (enquiry) => {
  const merit = parseMerit(enquiry);
  const parts = [
    merit.class10 && `Class 10: ${merit.class10}`,
    merit.class12 && `Class 12: ${merit.class12}`,
    merit.iti && `ITI: ${merit.iti}`,
    merit.other && `Other${merit.otherDescription ? ` (${merit.otherDescription})` : ''}: ${merit.other}`
  ].filter(Boolean);
  return parts.join('; ');
};

const parseBranches = (enquiry = {}) => {
  let branches = enquiry.branchesInterested;
  if (!branches) return [];
  if (typeof branches === 'string') {
    try {
      branches = JSON.parse(branches);
    } catch {
      return [];
    }
  }
  return Array.isArray(branches)
    ? branches.slice().sort((a, b) => Number(a.priority || 0) - Number(b.priority || 0))
    : [];
};

const getMaxBranchPriority = (enquiries) => {
  return Math.max(
    0,
    ...enquiries.flatMap(enquiry => parseBranches(enquiry).map(branch => Number(branch.priority || 0)))
  );
};

const getBranchByPriority = (enquiry, priority) => {
  return parseBranches(enquiry).find(branch => Number(branch.priority) === priority)?.branch || '';
};

const downloadCsv = (filename, headers, rows) => {
  let csvContent = headers.join(',') + '\n';
  rows.forEach(row => {
    csvContent += row.map(cell => {
      const escaped = String(cell ?? '').replace(/"/g, '""');
      return /[",\n]/.test(escaped) ? `"${escaped}"` : escaped;
    }).join(',') + '\n';
  });

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}_${new Date().getTime()}.csv`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

export const exportToExcel = (enquiries, selectedFields = null) => {
  try {
    let headers;
    let rows;
    const maxBranchPriority = getMaxBranchPriority(enquiries);
    const branchPriorityFields = Array.from({ length: maxBranchPriority }, (_, index) => ({
      key: `branchPriority${index + 1}`,
      label: `Branch Priority ${index + 1}`,
      priority: index + 1
    }));

    if (selectedFields && Array.isArray(selectedFields) && selectedFields.length > 0) {
      const expandedFields = selectedFields.flatMap(field => (
        field === 'branchesInterested' ? branchPriorityFields : [{ key: field, label: field }]
      ));
      headers = expandedFields.map(field => field.label);
      rows = enquiries.map((enquiry) => expandedFields.map(field => {
        if (field.priority) return getBranchByPriority(enquiry, field.priority);
        const fieldKey = field.key;
        if (fieldKey === 'merit' || fieldKey === 'meritDetails') return formatMerit(enquiry);
        return enquiry[fieldKey] !== undefined ? enquiry[fieldKey] : '';
      }));
    } else {
      headers = [
        'S.No',
        'Name',
        'Email',
        'Phone',
        'Admission For',
        ...branchPriorityFields.map(field => field.label),
        'Location',
        'Category',
        'Status',
        'Date'
      ];
      rows = enquiries.map((enquiry, index) => {
        const fullName = `${enquiry.firstName || ''} ${enquiry.middleName ? enquiry.middleName + ' ' : ''}${enquiry.lastName || ''}`.trim();
        return [
          index + 1,
          fullName,
          enquiry.email,
          enquiry.personalMobileNumber,
          enquiry.admissionFor || '-',
          ...branchPriorityFields.map(field => getBranchByPriority(enquiry, field.priority)),
          enquiry.location === 'Other' ? enquiry.otherLocation : enquiry.location,
          enquiry.category || '-',
          enquiry.status,
          formatDate(enquiry.enquiryDate)
        ];
      });
    }
    downloadCsv('enquiries', headers, rows);
  } catch (error) {
    console.error('Error exporting enquiries:', error);
    throw new Error('Failed to export enquiries');
  }
};

const getAdmissionFieldValue = (admission, field, index) => {
  if (field === 'sNo') return index + 1;
  if (field === 'fullName') {
    return `${admission.applicantFirstName || ''} ${admission.applicantMiddleName ? admission.applicantMiddleName + ' ' : ''}${admission.applicantLastName || ''}`.trim();
  }
  return admission[field] ?? '';
};

export const exportAdmissionsToExcel = (admissions, type = 'admissions', selectedFields = null) => {
  try {
    const fields = selectedFields && selectedFields.length
      ? ['sNo', ...selectedFields]
      : ['sNo', 'admissionType', 'fullName', 'studentEmail', 'mobileNo', 'program', 'category', 'status', 'gender', 'dateOfBirth', 'aadhaarNo', 'createdAt', 'updatedAt'];
    const labelMap = {
      sNo: 'S.No',
      admissionType: 'Admission Type',
      fullName: 'Name',
      studentEmail: 'Email',
      mobileNo: 'Phone',
      program: 'Program',
      category: 'Category',
      status: 'Status',
      gender: 'Gender',
      dateOfBirth: 'DOB',
      aadhaarNo: 'Aadhaar',
      createdAt: 'Created At',
      updatedAt: 'Updated At'
    };
    const headers = fields.map(field => labelMap[field] || field);
    const rows = admissions.map((admission, index) => fields.map(field => getAdmissionFieldValue(admission, field, index)));
    downloadCsv(`${type}_admissions`, headers, rows);
  } catch (error) {
    console.error('Error exporting admissions:', error);
    throw new Error('Failed to export admissions');
  }
};
