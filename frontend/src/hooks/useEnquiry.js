import { useState, useCallback } from 'react';
import { getAllEnquiries, createEnquiry, updateEnquiry, deleteEnquiry } from '../services/enquiryService';

// Custom hook for enquiry operations
export function useEnquiry() {
  const [enquiries, setEnquiries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchEnquiries = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getAllEnquiries();
      setEnquiries(data);
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const addEnquiry = useCallback(async (enquiryData) => {
    try {
      const newEnquiry = await createEnquiry(enquiryData);
      setEnquiries([...enquiries, newEnquiry]);
      return newEnquiry;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, [enquiries]);

  const editEnquiry = useCallback(async (id, enquiryData) => {
    try {
      const updated = await updateEnquiry(id, enquiryData);
      setEnquiries(enquiries.map(e => e.id === id ? updated : e));
      return updated;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, [enquiries]);

  const removeEnquiry = useCallback(async (id) => {
    try {
      await deleteEnquiry(id);
      setEnquiries(enquiries.filter(e => e.id !== id));
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, [enquiries]);

  return {
    enquiries,
    loading,
    error,
    fetchEnquiries,
    addEnquiry,
    editEnquiry,
    removeEnquiry
  };
}
