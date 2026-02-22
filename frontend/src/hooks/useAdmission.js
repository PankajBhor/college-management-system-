import { useState, useCallback } from 'react';
import { admissionService } from '../services/admissionService';

// Custom hook for admission operations
export function useAdmission() {
  const [fyAdmissions, setFYAdmissions] = useState([]);
  const [dsyAdmissions, setDSYAdmissions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // FY Admission Methods
  const fetchFYAdmissions = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await admissionService.getAllFYAdmissions();
      setFYAdmissions(data);
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchFYAdmissionsByStatus = useCallback(async (status) => {
    setLoading(true);
    setError(null);
    try {
      const data = await admissionService.getFYAdmissionsByStatus(status);
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
  const fetchDSYAdmissions = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await admissionService.getAllDSYAdmissions();
      setDSYAdmissions(data);
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchDSYAdmissionsByStatus = useCallback(async (status) => {
    setLoading(true);
    setError(null);
    try {
      const data = await admissionService.getDSYAdmissionsByStatus(status);
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
    fetchFYAdmissions,
    fetchFYAdmissionsByStatus,
    updateFY,
    removeFY,
    // DSY
    dsyAdmissions,
    fetchDSYAdmissions,
    fetchDSYAdmissionsByStatus,
    updateDSY,
    removeDSY,
    // Common
    loading,
    error
  };
}
