import { formatDate } from './formatters';

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
    if (selectedFields && Array.isArray(selectedFields) && selectedFields.length > 0) {
      headers = selectedFields;
      rows = enquiries.map((enquiry) => headers.map(field => enquiry[field] !== undefined ? enquiry[field] : ''));
    } else {
      headers = ['S.No', 'Name', 'Email', 'Phone', 'Admission For', 'Branches Interested', 'Location', 'Category', 'Status', 'Date'];
      rows = enquiries.map((enquiry, index) => {
        const fullName = `${enquiry.firstName || ''} ${enquiry.middleName ? enquiry.middleName + ' ' : ''}${enquiry.lastName || ''}`.trim();
        return [
          index + 1,
          fullName,
          enquiry.email,
          enquiry.personalMobileNumber,
          enquiry.admissionFor || '-',
          enquiry.branchesInterested || '-',
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
