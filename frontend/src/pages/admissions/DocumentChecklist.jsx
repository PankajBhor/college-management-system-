import React, { useState } from 'react';
import './DocumentChecklist.css';

const DocumentChecklist = ({ documents, admissionType }) => {
  const [checkedDocs, setCheckedDocs] = useState({});

  const handleDocumentCheck = (index) => {
    setCheckedDocs(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  const documentTitle = admissionType === 'FY' 
    ? 'Required Documents for First Year Admission' 
    : 'Required Documents for Direct Second Year Admission';

  const documentCount = admissionType === 'FY' ? 10 : 7;

  return (
    <fieldset className="form-section documents-section">
      <legend>{documentTitle} ({documentCount} Documents)</legend>
      
      <div className="documents-checklist">
        <table className="documents-table">
          <thead>
            <tr>
              <th className="sno">S.No.</th>
              <th className="document-name">Documents</th>
              <th className="checkbox-col">Original</th>
              <th className="checkbox-col">Attested Copy</th>
            </tr>
          </thead>
          <tbody>
            {documents.map((doc, index) => (
              <tr key={index} className="document-row">
                <td className="sno">{index + 1}</td>
                <td className="document-name">{doc.documentName}</td>
                <td className="checkbox-col">
                  <input 
                    type="checkbox" 
                    id={`original-${index}`}
                    onChange={() => handleDocumentCheck(`original-${index}`)}
                    checked={checkedDocs[`original-${index}`] || false}
                  />
                </td>
                <td className="checkbox-col">
                  <input 
                    type="checkbox" 
                    id={`copy-${index}`}
                    onChange={() => handleDocumentCheck(`copy-${index}`)}
                    checked={checkedDocs[`copy-${index}`] || false}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="documents-notes">
        <p><strong>Note:</strong> Please ensure all required documents are submitted along with the application form.</p>
        <p><strong>Documents Status:</strong> {Object.values(checkedDocs).filter(Boolean).length} / {documents.length * 2} items marked</p>
      </div>
    </fieldset>
  );
};

export default DocumentChecklist;
