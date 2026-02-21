package com.college.colllege_backend.service;

import com.college.colllege_backend.dto.DSYAdmissionRequestDTO;
import com.college.colllege_backend.entity.DSYAdmission;
import java.util.List;

public interface DSYAdmissionService {
    DSYAdmission createDSYAdmission(DSYAdmissionRequestDTO request);
    DSYAdmission getDSYAdmissionById(Long id);
    List<DSYAdmission> getAllDSYAdmissions();
    List<DSYAdmission> getDSYAdmissionsByStatus(String status);
    List<DSYAdmission> getDSYAdmissionsByAdmissionType(String admissionType);
    DSYAdmission updateDSYAdmission(Long id, DSYAdmissionRequestDTO request);
    void deleteDSYAdmission(Long id);
}
