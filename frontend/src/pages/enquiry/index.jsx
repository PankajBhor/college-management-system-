import React, { useState, useEffect } from 'react';
import { useEnquiry } from '../../hooks/useEnquiry';
import { useAuth } from '../../hooks/useAuth';
import EnquiryList from './EnquiryList';
import Modal from '../../components/Modal';// helper dropdown data
import {
  locationOptions,
  categoryOptions,
  branchOptions,
  admissionForOptions
} from '../../data/mockEnquiries';
const EnquiryIndex = () => {
  const { enquiries, loading, fetchEnquiries, addEnquiry, removeEnquiry } = useEnquiry();
  const { user } = useAuth();
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState(''); // 'new' or 'empty'

  // filter state for the table
  const [filters, setFilters] = useState({
    admissionFor: '',
    branch: '',
    branchPriority: '',
    location: '',
    category: '',
    status: '',
    date: ''
  });

  useEffect(() => {
    fetchEnquiries();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleNewEnquiry = async (formData) => {
    try {
      await addEnquiry(formData);
      setShowModal(false);
      alert('Enquiry added successfully!');
    } catch (error) {
      alert('Error adding enquiry: ' + error.message);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this enquiry?')) {
      try {
        await removeEnquiry(id);
        alert('Enquiry deleted successfully!');
      } catch (error) {
        alert('Error deleting enquiry: ' + error.message);
      }
    }
  };

  const handleStatusUpdate = async (id, newStatus) => {
    // The status has already been updated in the backend by the EnquiryList component
    // Just refresh the enquiries to reflect the change
    try {
      await fetchEnquiries();
    } catch (error) {
      console.error('Error refreshing enquiries after status update:', error);
    }
  };

  // build filtered list based on current filters
  const getFilteredEnquiries = () => {
    return enquiries.filter((e) => {
      if (filters.admissionFor && e.admissionFor !== filters.admissionFor) return false;
      if (filters.location && e.location !== filters.location) return false;
      if (filters.category && e.category !== filters.category) return false;
      if (filters.status && e.status !== filters.status) return false;
      if (filters.date && e.enquiryDate !== filters.date) return false;
      if (filters.branch) {
        let branches = e.branchesInterested;
        if (typeof branches === 'string') {
          try {
            branches = JSON.parse(branches);
          } catch (_){ branches = []; }
        }
        const match = branches.find(b => {
          const basic = b.branch === filters.branch;
          if (!basic) return false;
          if (filters.branchPriority) {
            return String(b.priority) === filters.branchPriority;
          }
          return true;
        });
        if (!match) return false;
      }
      return true;
    });
  };

  // helper to render dropdown options
  const renderOptions = (options) =>
    options.map((opt) => (
      <option key={opt} value={opt}>
        {opt}
      </option>
    ));

  // Check if user is enquiry staff or principal
  const canAddEnquiry = user && (user.role === 'ENQUIRY_STAFF' || user.role === 'PRINCIPAL');

  return (
    <div>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '30px'
      }}>
        <h2 style={{
          color: '#2c3e50',
          margin: 0,
          fontSize: '2em',
          fontWeight: '600'
        }}>
          📞 Enquiries
        </h2>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <button
            onClick={() => {
              setFilters({
                admissionFor: '',
                branch: '',
                branchPriority: '',
                location: '',
                category: '',
                status: '',
                date: ''
              });
            }}
            style={{
              padding: '8px 16px',
              background: '#6c757d',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '0.9em',
              fontWeight: '500'
            }}
            onMouseOver={(e) => {
              e.target.style.background = '#5a6268';
            }}
            onMouseOut={(e) => {
              e.target.style.background = '#6c757d';
            }}
          >
            🔄 Clear Filters
          </button>
          {canAddEnquiry && (
            <button
              onClick={() => {
                setModalType('new');
                setShowModal(true);
              }}
              style={{
                padding: '10px 20px',
                background: '#28a745',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '0.95em',
                fontWeight: '600'
              }}
              onMouseOver={(e) => {
                e.target.style.background = '#218838';
              }}
              onMouseOut={(e) => {
                e.target.style.background = '#28a745';
              }}
            >
              ➕ New Enquiry
            </button>
          )}
        </div>
      </div>

      {loading ? (
        <div style={{
          textAlign: 'center',
          padding: '40px',
          color: '#666',
          fontSize: '1.1em'
        }}>
          ⏳ Loading enquiries...
        </div>
      ) : enquiries.length === 0 ? (
        <div style={{
          textAlign: 'center',
          padding: '40px',
          background: '#f8f9fa',
          borderRadius: '15px',
          color: '#666'
        }}>
          <p style={{ fontSize: '1.1em', margin: '0 0 10px 0' }}>📭 No enquiries yet</p>
          <button
            onClick={() => {
              setModalType('new');
              setShowModal(true);
            }}
            style={{
              padding: '10px 20px',
              background: '#28a745',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '1em'
            }}
          >
            Add First Enquiry
          </button>
        </div>
      ) : (
        <EnquiryList
          enquiries={getFilteredEnquiries()}
          onDelete={handleDelete}
          onStatusUpdate={handleStatusUpdate}
          filters={filters}
          setFilters={setFilters}
          allEnquiries={enquiries}
        />
      )}

      {canAddEnquiry && (
        <Modal
          isOpen={showModal}
          title={modalType === 'new' ? 'New Enquiry' : 'Edit Enquiry'}
          onClose={() => setShowModal(false)}
        >
          <NewEnquiryForm onSubmit={handleNewEnquiry} onCancel={() => setShowModal(false)} />
        </Modal>
      )}
    </div>
  );
};

// Simple form component for the modal
const NewEnquiryForm = ({ onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    studentName: '',
    email: '',
    phone: '',
    course: '',
    status: 'Pending',
    notes: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.studentName || !formData.email || !formData.phone) {
      alert('Please fill all required fields');
      return;
    }
    onSubmit(formData);
    setFormData({
      studentName: '',
      email: '',
      phone: '',
      course: '',
      status: 'Pending',
      notes: ''
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <div style={{ marginBottom: '15px' }}>
        <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>
          Student Name *
        </label>
        <input
          type="text"
          value={formData.studentName}
          onChange={(e) => setFormData({ ...formData, studentName: e.target.value })}
          style={{
            width: '100%',
            padding: '10px',
            border: '1px solid #ddd',
            borderRadius: '8px',
            fontSize: '1em',
            boxSizing: 'border-box',
            fontFamily: 'inherit'
          }}
        />
      </div>

      <div style={{ marginBottom: '15px' }}>
        <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>
          Email *
        </label>
        <input
          type="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          style={{
            width: '100%',
            padding: '10px',
            border: '1px solid #ddd',
            borderRadius: '8px',
            fontSize: '1em',
            boxSizing: 'border-box',
            fontFamily: 'inherit'
          }}
        />
      </div>

      <div style={{ marginBottom: '15px' }}>
        <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>
          Phone *
        </label>
        <input
          type="tel"
          value={formData.phone}
          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          style={{
            width: '100%',
            padding: '10px',
            border: '1px solid #ddd',
            borderRadius: '8px',
            fontSize: '1em',
            boxSizing: 'border-box',
            fontFamily: 'inherit'
          }}
        />
      </div>

      <div style={{ marginBottom: '15px' }}>
        <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>
          Course
        </label>
        <input
          type="text"
          value={formData.course}
          onChange={(e) => setFormData({ ...formData, course: e.target.value })}
          placeholder="e.g., B.Tech - CSE"
          style={{
            width: '100%',
            padding: '10px',
            border: '1px solid #ddd',
            borderRadius: '8px',
            fontSize: '1em',
            boxSizing: 'border-box',
            fontFamily: 'inherit'
          }}
        />
      </div>

      <div style={{ marginBottom: '15px' }}>
        <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>
          Status
        </label>
        <select
          value={formData.status}
          onChange={(e) => setFormData({ ...formData, status: e.target.value })}
          style={{
            width: '100%',
            padding: '10px',
            border: '1px solid #ddd',
            borderRadius: '8px',
            fontSize: '1em',
            fontFamily: 'inherit'
          }}
        >
          <option>Pending</option>
          <option>Follow-up</option>
          <option>Converted</option>
          <option>Lost</option>
        </select>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>
          Notes
        </label>
        <textarea
          value={formData.notes}
          onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
          style={{
            width: '100%',
            padding: '10px',
            border: '1px solid #ddd',
            borderRadius: '8px',
            fontSize: '1em',
            minHeight: '80px',
            fontFamily: 'inherit',
            boxSizing: 'border-box'
          }}
        />
      </div>

      <div style={{ display: 'flex', gap: '10px' }}>
        <button
          type="submit"
          style={{
            flex: 1,
            padding: '10px',
            background: '#28a745',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontWeight: '500',
            fontFamily: 'inherit'
          }}
        >
          Save Enquiry
        </button>
        <button
          type="button"
          onClick={onCancel}
          style={{
            flex: 1,
            padding: '10px',
            background: '#f0f0f0',
            color: '#333',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontWeight: '500',
            fontFamily: 'inherit'
          }}
        >
          Cancel
        </button>
      </div>
    </form>
  );
};

export default EnquiryIndex;

