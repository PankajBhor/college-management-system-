package com.college.colllege_backend.service;

import java.util.List;

import com.college.colllege_backend.dto.FYAdmissionRequestDTO;
import com.college.colllege_backend.entity.FYAdmission;

public interface FYAdmissionService {

    FYAdmission createFYAdmission(FYAdmissionRequestDTO request);

    FYAdmission getFYAdmissionById(Long id);

    List<FYAdmission> getAllFYAdmissions();

    List<FYAdmission> getFYAdmissionsByStatus(String status);

    List<FYAdmission> getFYAdmissionsByAdmissionType(String admissionType);

    FYAdmission updateFYAdmission(Long id, FYAdmissionRequestDTO request);

    void deleteFYAdmission(Long id);
}
