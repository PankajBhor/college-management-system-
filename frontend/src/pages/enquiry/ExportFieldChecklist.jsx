import React from 'react';
import Modal from '../../components/Modal';

const FIELD_LABELS = {
  firstName: 'First Name',
  middleName: 'Middle Name',
  lastName: 'Last Name',
  personalMobileNumber: 'Personal Mobile',
  guardianMobileNumber: 'Guardian Mobile',
  email: 'Email',
  merit: 'Merit',
  admissionFor: 'Admission For',
  location: 'Location',
  otherLocation: 'Other Location',
  category: 'Category',
  branchesInterested: 'Branches Interested',
  referenceFaculty: 'Reference Faculty',
  dteRegistrationDone: 'DTE Registration Done',
  enquiryDate: 'Enquiry Date',
  status: 'Status',
};

const ADMISSION_FIELD_LABELS = {
  fullName: 'Name',
  studentEmail: 'Email',
  mobileNo: 'Phone',
  program: 'Program',
  category: 'Category',
  status: 'Status',
  admissionType: 'Admission Type',
  gender: 'Gender',
  dateOfBirth: 'Date of Birth',
  aadhaarNo: 'Aadhaar',
  createdAt: 'Created At',
  updatedAt: 'Updated At',
};

export default function ExportFieldChecklist({
  open, fields, setFields, onExport, onClose, mode = 'enquiries'
}) {
  const labels = mode === 'admissions' ? ADMISSION_FIELD_LABELS : FIELD_LABELS;

  return (
    <Modal
      isOpen={open}
      title="Select Fields to Export"
      onClose={onClose}
      onConfirm={onExport}
      confirmText="Export"
      cancelText="Cancel"
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {Object.entries(labels).map(([key, label]) => (
          <label key={key} style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={fields.includes(key)}
              onChange={e => {
                setFields(f => e.target.checked ? [...f, key] : f.filter(x => x !== key));
              }}
              style={{ cursor: 'pointer' }}
            />
            {label}
          </label>
        ))}
      </div>
    </Modal>
  );
}
