import React, { useState, useEffect } from 'react';
import { useEnquiry } from '../../hooks/useEnquiry';
import EnquiryList from './EnquiryList';
import Modal from '../../components/Modal';

const EnquiryIndex = () => {
  const { enquiries, loading, fetchEnquiries, addEnquiry, removeEnquiry } = useEnquiry();
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState(''); // 'new' or 'empty'

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
        <button
          onClick={() => {
            setModalType('new');
            setShowModal(true);
          }}
          style={{
            padding: '12px 25px',
            background: '#28a745',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '1em',
            fontWeight: '500',
            transition: 'background 0.3s ease'
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
        <EnquiryList enquiries={enquiries} onDelete={handleDelete} />
      )}

      <Modal
        isOpen={showModal}
        title={modalType === 'new' ? 'New Enquiry' : 'Edit Enquiry'}
        onClose={() => setShowModal(false)}
      >
        <NewEnquiryForm onSubmit={handleNewEnquiry} onCancel={() => setShowModal(false)} />
      </Modal>
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
