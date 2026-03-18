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

export default function ExportFieldChecklist({
  open, fields, setFields, onExport, onClose
}) {
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
        {Object.entries(FIELD_LABELS).map(([key, label]) => (
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
