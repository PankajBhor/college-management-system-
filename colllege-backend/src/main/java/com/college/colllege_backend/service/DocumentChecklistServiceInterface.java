package com.college.colllege_backend.service;

import java.util.List;

import com.college.colllege_backend.dto.DocumentChecklistDTO;

public interface DocumentChecklistServiceInterface {

    List<DocumentChecklistDTO> getDocumentsByAdmissionType(String admissionType);

    void initializeDefaultDocuments();
}
