package com.college.colllege_backend.service.impl;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.college.colllege_backend.dto.EnquiryRequestDTO;
import com.college.colllege_backend.dto.EnquiryResponseDTO;
import com.college.colllege_backend.entity.Enquiry;
import com.college.colllege_backend.repository.EnquiryRepository;
import com.college.colllege_backend.service.EnquiryService;

@Service
public class EnquiryServiceImpl implements EnquiryService {

    @Autowired
    private EnquiryRepository enquiryRepository;

    @Override
    public EnquiryResponseDTO createEnquiry(EnquiryRequestDTO request) {
        Enquiry enquiry = new Enquiry();
        enquiry.setFirstName(request.getFirstName());
        enquiry.setMiddleName(request.getMiddleName());
        enquiry.setLastName(request.getLastName());
        enquiry.setPersonalMobileNumber(request.getPersonalMobileNumber());
        enquiry.setGuardianMobileNumber(request.getGuardianMobileNumber());
        enquiry.setEmail(request.getEmail());
        enquiry.setMeritDetails(request.getMeritDetails());
        enquiry.setAdmissionFor(request.getAdmissionFor());
        enquiry.setLocation(request.getLocation());
        enquiry.setOtherLocation(request.getOtherLocation());
        enquiry.setCategory(request.getCategory());
        enquiry.setBranchesInterested(request.getBranchesInterested());
        enquiry.setReferenceFaculty(request.getReferenceFaculty());
        enquiry.setStatus("Pending");
        enquiry.setEnquiryDate(request.getEnquiryDate());

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
        return enquiryRepository.findByStatus(status)
                .stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public EnquiryResponseDTO updateEnquiry(Long id, EnquiryRequestDTO request) {
        Enquiry enquiry = enquiryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Enquiry not found"));

        if (request.getFirstName() != null) {
            enquiry.setFirstName(request.getFirstName());
        }
        if (request.getMiddleName() != null) {
            enquiry.setMiddleName(request.getMiddleName());
        }
        if (request.getLastName() != null) {
            enquiry.setLastName(request.getLastName());
        }
        if (request.getPersonalMobileNumber() != null) {
            enquiry.setPersonalMobileNumber(request.getPersonalMobileNumber());
        }
        if (request.getGuardianMobileNumber() != null) {
            enquiry.setGuardianMobileNumber(request.getGuardianMobileNumber());
        }
        if (request.getEmail() != null) {
            enquiry.setEmail(request.getEmail());
        }
        if (request.getMeritDetails() != null) {
            enquiry.setMeritDetails(request.getMeritDetails());
        }
        if (request.getAdmissionFor() != null) {
            enquiry.setAdmissionFor(request.getAdmissionFor());
        }
        if (request.getLocation() != null) {
            enquiry.setLocation(request.getLocation());
        }
        if (request.getOtherLocation() != null) {
            enquiry.setOtherLocation(request.getOtherLocation());
        }
        if (request.getCategory() != null) {
            enquiry.setCategory(request.getCategory());
        }
        if (request.getBranchesInterested() != null) {
            enquiry.setBranchesInterested(request.getBranchesInterested());
        }
        if (request.getReferenceFaculty() != null) {
            enquiry.setReferenceFaculty(request.getReferenceFaculty());
        }
        if (request.getStatus() != null) {
            enquiry.setStatus(request.getStatus());
        }
        if (request.getEnquiryDate() != null) {
            enquiry.setEnquiryDate(request.getEnquiryDate());
        }

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
                enquiry.getFirstName(),
                enquiry.getMiddleName(),
                enquiry.getLastName(),
                enquiry.getPersonalMobileNumber(),
                enquiry.getGuardianMobileNumber(),
                enquiry.getEmail(),
                enquiry.getMeritDetails(),
                enquiry.getAdmissionFor(),
                enquiry.getLocation(),
                enquiry.getOtherLocation(),
                enquiry.getCategory(),
                enquiry.getBranchesInterested(),
                enquiry.getReferenceFaculty(),
                enquiry.getStatus(),
                enquiry.getEnquiryDate(),
                enquiry.getCreatedAt(),
                enquiry.getUpdatedAt()
        );
    }
}
