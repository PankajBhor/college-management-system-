package com.college.colllege_backend.service.impl;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.college.colllege_backend.dto.EnquiryRequestDTO;
import com.college.colllege_backend.dto.EnquiryResponseDTO;
import com.college.colllege_backend.entity.Enquiry;
import com.college.colllege_backend.repository.EnquiryRepository;
import com.college.colllege_backend.service.EnquiryService;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;

@Service
@Transactional
public class EnquiryServiceImpl implements EnquiryService {

    @Autowired
    private EnquiryRepository enquiryRepository;
    private final ObjectMapper objectMapper = new ObjectMapper();

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
        enquiry.setBranchesInterested(branchesInterestedFromRequest(request));
        enquiry.setReferenceFaculty(request.getReferenceFaculty());
        enquiry.setSscSeatNo(request.getSscSeatNo());
        enquiry.setDteRegistrationDone(request.isDteRegistrationDone());
        enquiry.setEmailEnabled(request.isEmailEnabled());
        enquiry.setSelectedEmailPresetId(request.getSelectedEmailPresetId());
        enquiry.setProvisionalAdmission(request.isProvisionalAdmission());
        enquiry.setProvisionalAdmissionDate(request.isProvisionalAdmission() ? request.getProvisionalAdmissionDate() : null);
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

    @Transactional(readOnly = true)
    public Page<EnquiryResponseDTO> getAllEnquiriesPaginated(Pageable pageable) {
        return enquiryRepository.findAll(pageable)
                .map(this::mapToDTO);
    }

    @Override
    public List<EnquiryResponseDTO> getEnquiriesByStatus(String status) {
        return enquiryRepository.findByStatus(status)
                .stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public Page<EnquiryResponseDTO> getEnquiriesByStatusPaginated(String status, Pageable pageable) {
        return enquiryRepository.findByStatus(status, pageable)
                .map(this::mapToDTO);
    }

    @Transactional(readOnly = true)
    public Page<EnquiryResponseDTO> getEnquiriesByCategoryPaginated(String category, Pageable pageable) {
        return enquiryRepository.findByCategory(category, pageable)
                .map(this::mapToDTO);
    }

    @Transactional(readOnly = true)
    public Page<EnquiryResponseDTO> getEnquiriesByAdmissionPaginated(String admissionFor, Pageable pageable) {
        return enquiryRepository.findByAdmissionFor(admissionFor, pageable)
                .map(this::mapToDTO);
    }

    @Transactional(readOnly = true)
    public Page<EnquiryResponseDTO> getEnquiriesByLocationPaginated(String location, Pageable pageable) {
        return enquiryRepository.findByLocation(location, pageable)
                .map(this::mapToDTO);
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
        if (request.getBranchesInterested() == null) {
            enquiry.setBranchesInterested(branchesInterestedFromRequest(request));
        }
        if (request.getReferenceFaculty() != null) {
            enquiry.setReferenceFaculty(request.getReferenceFaculty());
        }
        if (request.getSscSeatNo() != null) {
            enquiry.setSscSeatNo(request.getSscSeatNo());
        }
        enquiry.setDteRegistrationDone(request.isDteRegistrationDone());
        enquiry.setEmailEnabled(request.isEmailEnabled());
        enquiry.setSelectedEmailPresetId(request.getSelectedEmailPresetId());
        enquiry.setProvisionalAdmission(request.isProvisionalAdmission());
        enquiry.setProvisionalAdmissionDate(request.isProvisionalAdmission() ? request.getProvisionalAdmissionDate() : null);
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
        EnquiryResponseDTO dto = new EnquiryResponseDTO(
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
                enquiry.getUpdatedAt(),
                enquiry.isDteRegistrationDone(),
                enquiry.getSscSeatNo()
        );
        dto.setEmailEnabled(enquiry.isEmailEnabled());
        dto.setSelectedEmailPresetId(enquiry.getSelectedEmailPresetId());
        dto.setProvisionalAdmission(enquiry.isProvisionalAdmission());
        dto.setProvisionalAdmissionDate(enquiry.getProvisionalAdmissionDate());
        dto.setBranchPriority1(branchByPriority(enquiry.getBranchesInterested(), 1));
        dto.setBranchPriority2(branchByPriority(enquiry.getBranchesInterested(), 2));
        dto.setBranchPriority3(branchByPriority(enquiry.getBranchesInterested(), 3));
        dto.setBranchPriority4(branchByPriority(enquiry.getBranchesInterested(), 4));
        return dto;
    }

    private String branchesInterestedFromRequest(EnquiryRequestDTO request) {
        if (request.getBranchesInterested() != null && !request.getBranchesInterested().isBlank()) {
            return request.getBranchesInterested();
        }
        List<String> priorities = List.of(
                request.getBranchPriority1() == null ? "" : request.getBranchPriority1(),
                request.getBranchPriority2() == null ? "" : request.getBranchPriority2(),
                request.getBranchPriority3() == null ? "" : request.getBranchPriority3(),
                request.getBranchPriority4() == null ? "" : request.getBranchPriority4()
        );
        StringBuilder builder = new StringBuilder("[");
        int priority = 1;
        for (String branch : priorities) {
            if (branch == null || branch.isBlank()) {
                continue;
            }
            if (priority > 1) {
                builder.append(",");
            }
            builder.append("{\"branch\":\"")
                    .append(branch.trim().replace("\\", "\\\\").replace("\"", "\\\""))
                    .append("\",\"priority\":")
                    .append(priority)
                    .append("}");
            priority++;
        }
        return builder.append("]").toString();
    }

    private String branchByPriority(String branchesInterested, int priority) {
        if (branchesInterested == null || branchesInterested.isBlank()) {
            return "";
        }
        try {
            List<Map<String, Object>> branches = objectMapper.readValue(branchesInterested, new TypeReference<List<Map<String, Object>>>() {});
            for (Map<String, Object> branch : branches) {
                Object saved = branch.get("priority");
                int savedPriority = saved instanceof Number ? ((Number) saved).intValue() : Integer.parseInt(String.valueOf(saved));
                if (savedPriority == priority) {
                    return String.valueOf(branch.getOrDefault("branch", ""));
                }
            }
        } catch (Exception ignored) {
            return "";
        }
        return "";
    }
}
