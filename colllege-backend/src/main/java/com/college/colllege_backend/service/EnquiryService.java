package com.college.colllege_backend.service;

import com.college.colllege_backend.dto.EnquiryRequestDTO;
import com.college.colllege_backend.dto.EnquiryResponseDTO;
import com.college.colllege_backend.enums.EnquiryStatus;
import java.util.List;

public interface EnquiryService {
    EnquiryResponseDTO createEnquiry(EnquiryRequestDTO request);
    EnquiryResponseDTO getEnquiryById(Long id);
    List<EnquiryResponseDTO> getAllEnquiries();
    List<EnquiryResponseDTO> getEnquiriesByStatus(String status);
    EnquiryResponseDTO updateEnquiry(Long id, EnquiryRequestDTO request);
    void deleteEnquiry(Long id);
}
