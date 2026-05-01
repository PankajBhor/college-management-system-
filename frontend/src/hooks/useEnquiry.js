import { useState, useCallback } from 'react';
import { getAllEnquiries, createEnquiry, updateEnquiry, deleteEnquiry } from '../services/enquiryService';

// Custom hook for enquiry operations
export function useEnquiry() {
  const [enquiries, setEnquiries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Pagination state
  const [pageNumber, setPageNumber] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);

  const fetchEnquiries = useCallback(async (page = 0, size = 10, sortBy = 'id', direction = 'DESC') => {
    setLoading(true);
    setError(null);
    try {
      const data = await getAllEnquiries(page, size, sortBy, direction);

      // Handle both paginated and non-paginated responses
      if (data.content) {
        // Paginated response from API
        setEnquiries(data.content);
        setPageNumber(data.pageNumber ?? data.number ?? page);
        setPageSize(data.pageSize ?? data.size ?? size);
        setTotalPages(data.totalPages);
        setTotalElements(data.totalElements);
      } else if (Array.isArray(data)) {
        // Non-paginated response (backward compatibility)
        setEnquiries(data);
        setPageNumber(0);
        setPageSize(data.length);
        setTotalPages(1);
        setTotalElements(data.length);
      }

      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const goToPage = useCallback((page) => {
    if (page >= 0 && page < totalPages) {
      return fetchEnquiries(page, pageSize);
    }
  }, [totalPages, pageSize, fetchEnquiries]);

  const changePageSize = useCallback((newSize) => {
    setPageSize(newSize);
    return fetchEnquiries(0, newSize); // Reset to first page
  }, [fetchEnquiries]);

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
    pageNumber,
    pageSize,
    totalPages,
    totalElements,
    fetchEnquiries,
    goToPage,
    changePageSize,
    addEnquiry,
    editEnquiry,
    removeEnquiry
  };
}
