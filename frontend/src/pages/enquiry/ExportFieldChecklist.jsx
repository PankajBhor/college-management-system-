import React from 'react';

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
  if (!open) return null;
  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
      background: 'rgba(0,0,0,0.25)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center'
    }}>
      <div style={{ background: 'white', borderRadius: 12, padding: 32, minWidth: 350 }}>
        <h3 style={{ marginTop: 0 }}>Select Fields to Export</h3>
        <form onSubmit={e => { e.preventDefault(); onExport(); }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 20 }}>
            {Object.entries(FIELD_LABELS).map(([key, label]) => (
              <label key={key} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <input
                  type="checkbox"
                  checked={fields.includes(key)}
                  onChange={e => {
                    setFields(f => e.target.checked ? [...f, key] : f.filter(x => x !== key));
                  }}
                />
                {label}
              </label>
            ))}
          </div>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
            <button type="button" onClick={onClose} style={{ padding: '8px 18px', background: '#ccc', border: 'none', borderRadius: 6 }}>Cancel</button>
            <button type="submit" style={{ padding: '8px 18px', background: '#2563eb', color: 'white', border: 'none', borderRadius: 6 }}>Export</button>
          </div>
        </form>
      </div>
    </div>
  );
}
