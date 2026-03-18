import { useState, useCallback } from 'react';
import { admissionService } from '../services/admissionService';

// Custom hook for admission operations
export function useAdmission() {
  const [fyAdmissions, setFYAdmissions] = useState([]);
  const [dsyAdmissions, setDSYAdmissions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // FY Pagination state
  const [fyPageNumber, setFYPageNumber] = useState(0);
  const [fyPageSize, setFYPageSize] = useState(10);
  const [fyTotalPages, setFYTotalPages] = useState(0);
  const [fyTotalElements, setFYTotalElements] = useState(0);

  // DSY Pagination state
  const [dsyPageNumber, setDSYPageNumber] = useState(0);
  const [dsyPageSize, setDSYPageSize] = useState(10);
  const [dsyTotalPages, setDSYTotalPages] = useState(0);
  const [dsyTotalElements, setDSYTotalElements] = useState(0);

  // FY Admission Methods
  const fetchFYAdmissions = useCallback(async (page = 0, size = 10, sortBy = 'id', direction = 'DESC') => {
    setLoading(true);
    setError(null);
    try {
      const data = await admissionService.getAllFYAdmissions(page, size, sortBy, direction);

      // Handle both paginated and non-paginated responses
      if (data.content) {
        setFYAdmissions(data.content);
        setFYPageNumber(data.pageNumber);
        setFYPageSize(data.pageSize);
        setFYTotalPages(data.totalPages);
        setFYTotalElements(data.totalElements);
      } else if (Array.isArray(data)) {
        setFYAdmissions(data);
        setFYPageNumber(0);
        setFYPageSize(data.length);
        setFYTotalPages(1);
        setFYTotalElements(data.length);
      }

      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const goToFYPage = useCallback((page) => {
    if (page >= 0 && page < fyTotalPages) {
      return fetchFYAdmissions(page, fyPageSize);
    }
  }, [fyTotalPages, fyPageSize, fetchFYAdmissions]);

  const changeFYPageSize = useCallback((newSize) => {
    setFYPageSize(newSize);
    return fetchFYAdmissions(0, newSize);
  }, [fetchFYAdmissions]);

  const fetchFYAdmissionsByStatus = useCallback(async (status, page = 0, size = 10) => {
    setLoading(true);
    setError(null);
    try {
      const data = await admissionService.getFYAdmissionsByStatus(status, page, size);

      if (data.content) {
        setFYAdmissions(data.content);
        setFYPageNumber(data.pageNumber);
        setFYPageSize(data.pageSize);
        setFYTotalPages(data.totalPages);
        setFYTotalElements(data.totalElements);
      } else if (Array.isArray(data)) {
        setFYAdmissions(data);
        setFYPageNumber(0);
        setFYPageSize(data.length);
        setFYTotalPages(1);
        setFYTotalElements(data.length);
      }

      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateFY = useCallback(async (id, admissionData) => {
    try {
      const updated = await admissionService.updateFYAdmission(id, admissionData);
      setFYAdmissions(fyAdmissions.map(a => a.id === id ? updated : a));
      return updated;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, [fyAdmissions]);

  const removeFY = useCallback(async (id) => {
    try {
      await admissionService.deleteFYAdmission(id);
      setFYAdmissions(fyAdmissions.filter(a => a.id !== id));
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, [fyAdmissions]);

  // DSY Admission Methods
  const fetchDSYAdmissions = useCallback(async (page = 0, size = 10, sortBy = 'id', direction = 'DESC') => {
    setLoading(true);
    setError(null);
    try {
      const data = await admissionService.getAllDSYAdmissions(page, size, sortBy, direction);

      if (data.content) {
        setDSYAdmissions(data.content);
        setDSYPageNumber(data.pageNumber);
        setDSYPageSize(data.pageSize);
        setDSYTotalPages(data.totalPages);
        setDSYTotalElements(data.totalElements);
      } else if (Array.isArray(data)) {
        setDSYAdmissions(data);
        setDSYPageNumber(0);
        setDSYPageSize(data.length);
        setDSYTotalPages(1);
        setDSYTotalElements(data.length);
      }

      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const goToDSYPage = useCallback((page) => {
    if (page >= 0 && page < dsyTotalPages) {
      return fetchDSYAdmissions(page, dsyPageSize);
    }
  }, [dsyTotalPages, dsyPageSize, fetchDSYAdmissions]);

  const changeDSYPageSize = useCallback((newSize) => {
    setDSYPageSize(newSize);
    return fetchDSYAdmissions(0, newSize);
  }, [fetchDSYAdmissions]);

  const fetchDSYAdmissionsByStatus = useCallback(async (status, page = 0, size = 10) => {
    setLoading(true);
    setError(null);
    try {
      const data = await admissionService.getDSYAdmissionsByStatus(status, page, size);

      if (data.content) {
        setDSYAdmissions(data.content);
        setDSYPageNumber(data.pageNumber);
        setDSYPageSize(data.pageSize);
        setDSYTotalPages(data.totalPages);
        setDSYTotalElements(data.totalElements);
      } else if (Array.isArray(data)) {
        setDSYAdmissions(data);
        setDSYPageNumber(0);
        setDSYPageSize(data.length);
        setDSYTotalPages(1);
        setDSYTotalElements(data.length);
      }

      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateDSY = useCallback(async (id, admissionData) => {
    try {
      const updated = await admissionService.updateDSYAdmission(id, admissionData);
      setDSYAdmissions(dsyAdmissions.map(a => a.id === id ? updated : a));
      return updated;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, [dsyAdmissions]);

  const removeDSY = useCallback(async (id) => {
    try {
      await admissionService.deleteDSYAdmission(id);
      setDSYAdmissions(dsyAdmissions.filter(a => a.id !== id));
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, [dsyAdmissions]);

  return {
    // FY
    fyAdmissions,
    fyPageNumber,
    fyPageSize,
    fyTotalPages,
    fyTotalElements,
    fetchFYAdmissions,
    fetchFYAdmissionsByStatus,
    goToFYPage,
    changeFYPageSize,
    updateFY,
    removeFY,
    // DSY
    dsyAdmissions,
    dsyPageNumber,
    dsyPageSize,
    dsyTotalPages,
    dsyTotalElements,
    fetchDSYAdmissions,
    fetchDSYAdmissionsByStatus,
    goToDSYPage,
    changeDSYPageSize,
    updateDSY,
    removeDSY,
    // Common
    loading,
    error
  };
}
