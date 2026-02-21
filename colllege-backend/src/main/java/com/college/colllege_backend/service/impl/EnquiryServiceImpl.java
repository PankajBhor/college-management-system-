package com.college.colllege_backend.service.impl;

import com.college.colllege_backend.dto.EnquiryRequestDTO;
import com.college.colllege_backend.dto.EnquiryResponseDTO;
import com.college.colllege_backend.entity.Enquiry;
import com.college.colllege_backend.enums.EnquiryStatus;
import com.college.colllege_backend.repository.EnquiryRepository;
import com.college.colllege_backend.service.EnquiryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class EnquiryServiceImpl implements EnquiryService {
    @Autowired
    private EnquiryRepository enquiryRepository;

    @Override
    public EnquiryResponseDTO createEnquiry(EnquiryRequestDTO request) {
        Enquiry enquiry = new Enquiry();
        enquiry.setStudentName(request.getStudentName());
        enquiry.setEmail(request.getEmail());
        enquiry.setPhone(request.getPhone());
        enquiry.setCourse(request.getCourse());
        enquiry.setStatus(EnquiryStatus.valueOf(request.getStatus() != null ? request.getStatus() : "PENDING"));
        enquiry.setNotes(request.getNotes());
        enquiry.setCreatedBy(request.getCreatedBy());
        enquiry.setEnquiryDate(LocalDate.now());

        Enquiry saved = enquiryRepository.save(enquiry);
        return mapToDTO(saved);
    }

    @Override
    public EnquiryResponseDTO getEnquiryById(Long id) {
        return enquiryRepository.findById(id)
            .map(this::mapToDTO)
            .orElseThrow(() -> new RuntimeException("Enquiry not found"));
    }

    @Override
    public List<EnquiryResponseDTO> getAllEnquiries() {
        return enquiryRepository.findAll().stream()
            .map(this::mapToDTO)
            .collect(Collectors.toList());
    }

    @Override
    public List<EnquiryResponseDTO> getEnquiriesByStatus(String status) {
        return enquiryRepository.findByStatus(EnquiryStatus.valueOf(status))
            .stream()
            .map(this::mapToDTO)
            .collect(Collectors.toList());
    }

    @Override
    public EnquiryResponseDTO updateEnquiry(Long id, EnquiryRequestDTO request) {
        Enquiry enquiry = enquiryRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Enquiry not found"));

        enquiry.setStudentName(request.getStudentName());
        enquiry.setEmail(request.getEmail());
        enquiry.setPhone(request.getPhone());
        enquiry.setCourse(request.getCourse());
        enquiry.setStatus(EnquiryStatus.valueOf(request.getStatus()));
        enquiry.setNotes(request.getNotes());

        Enquiry updated = enquiryRepository.save(enquiry);
        return mapToDTO(updated);
    }

    @Override
    public void deleteEnquiry(Long id) {
        enquiryRepository.deleteById(id);
    }

    private EnquiryResponseDTO mapToDTO(Enquiry enquiry) {
        return new EnquiryResponseDTO(
            enquiry.getId(),
            enquiry.getStudentName(),
            enquiry.getEmail(),
            enquiry.getPhone(),
            enquiry.getCourse(),
            enquiry.getEnquiryDate(),
            enquiry.getStatus().toString(),
            enquiry.getNotes(),
            enquiry.getCreatedBy()
        );
    }
}
