package com.college.colllege_backend.controller;

import java.util.List;
import java.util.stream.Collectors;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.college.colllege_backend.dto.EnquiryRequestDTO;
import com.college.colllege_backend.dto.EnquiryResponseDTO;
import com.college.colllege_backend.entity.EmailPreset;
import com.college.colllege_backend.entity.Enquiry;
import com.college.colllege_backend.repository.EmailPresetRepository;
import com.college.colllege_backend.repository.EnquiryRepository;
import com.college.colllege_backend.service.impl.EnquiryServiceImpl;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/enquiries")
@CrossOrigin(origins = "http://localhost:3000")
public class EnquiryController {

    private static final Logger logger = LoggerFactory.getLogger(EnquiryController.class);

    @Autowired
    private EnquiryRepository enquiryRepository;

    @Autowired
    private EnquiryServiceImpl enquiryService;

    @Autowired
    private com.college.colllege_backend.service.EmailService emailService;

    @Autowired
    private EmailPresetRepository emailPresetRepository;

    private final ObjectMapper objectMapper = new ObjectMapper();

    @GetMapping
    public ResponseEntity<?> getAllEnquiries(
            @RequestParam(required = false) Integer page,
            @RequestParam(required = false) Integer size,
            @RequestParam(defaultValue = "id") String sortBy,
            @RequestParam(defaultValue = "DESC") String direction) {
        if (page != null && size != null) {
            Sort.Direction sortDirection = Sort.Direction.fromString(direction.toUpperCase());
            Pageable pageable = PageRequest.of(page, size, Sort.by(sortDirection, sortBy));
            Page<EnquiryResponseDTO> result = enquiryService.getAllEnquiriesPaginated(pageable);
            return ResponseEntity.ok(result);
        }

        List<EnquiryResponseDTO> enquiries = enquiryRepository.findAll()
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
        return ResponseEntity.ok(enquiries);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getEnquiryById(@PathVariable Long id) {
        return enquiryRepository.findById(id)
                .map(enquiry -> ResponseEntity.ok(convertToDTO(enquiry)))
                .orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND).build());
    }

    @PostMapping
    public ResponseEntity<?> createEnquiry(@Valid @RequestBody EnquiryRequestDTO request) {
        try {
            Enquiry savedEnquiry = enquiryRepository.save(convertToEntity(request));
            sendSelectedEnquiryPreset(savedEnquiry);
            return ResponseEntity.status(HttpStatus.CREATED).body(convertToDTO(savedEnquiry));
        } catch (Exception e) {
            logger.error("Create enquiry failed", e);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("{\"error\": \"" + e.getMessage() + "\"}");
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateEnquiry(@PathVariable Long id, @Valid @RequestBody EnquiryRequestDTO request) {
        return enquiryRepository.findById(id)
                .map(enquiry -> {
                    copyRequestToEntity(request, enquiry);
                    Enquiry updatedEnquiry = enquiryRepository.save(enquiry);
                    return ResponseEntity.ok(convertToDTO(updatedEnquiry));
                })
                .orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND).build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteEnquiry(@PathVariable Long id) {
        if (enquiryRepository.existsById(id)) {
            enquiryRepository.deleteById(id);
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<?> updateStatus(@PathVariable Long id, @RequestBody java.util.Map<String, String> statusUpdate) {
        String newStatus = statusUpdate.get("status");
        if (newStatus == null || newStatus.trim().isEmpty()) {
            return ResponseEntity.badRequest().body("{\"error\": \"Status cannot be empty\"}");
        }

        return enquiryRepository.findById(id)
                .map(enquiry -> {
                    enquiry.setStatus(newStatus);
                    Enquiry updatedEnquiry = enquiryRepository.save(enquiry);
                    return ResponseEntity.ok(convertToDTO(updatedEnquiry));
                })
                .orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND).build());
    }

    @GetMapping("/by-status/{status}")
    public ResponseEntity<?> getEnquiriesByStatus(@PathVariable String status,
            @RequestParam(required = false) Integer page,
            @RequestParam(required = false) Integer size,
            @RequestParam(defaultValue = "id") String sortBy,
            @RequestParam(defaultValue = "DESC") String direction) {
        if (page != null && size != null) {
            Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.fromString(direction.toUpperCase()), sortBy));
            return ResponseEntity.ok(enquiryService.getEnquiriesByStatusPaginated(status, pageable));
        }
        return ResponseEntity.ok(enquiryRepository.findByStatus(status).stream().map(this::convertToDTO).collect(Collectors.toList()));
    }

    @GetMapping("/by-category/{category}")
    public ResponseEntity<?> getEnquiriesByCategory(@PathVariable String category,
            @RequestParam(required = false) Integer page,
            @RequestParam(required = false) Integer size,
            @RequestParam(defaultValue = "id") String sortBy,
            @RequestParam(defaultValue = "DESC") String direction) {
        if (page != null && size != null) {
            Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.fromString(direction.toUpperCase()), sortBy));
            return ResponseEntity.ok(enquiryService.getEnquiriesByCategoryPaginated(category, pageable));
        }
        return ResponseEntity.ok(enquiryRepository.findByCategory(category).stream().map(this::convertToDTO).collect(Collectors.toList()));
    }

    @GetMapping("/by-admission/{admissionFor}")
    public ResponseEntity<?> getEnquiriesByAdmission(@PathVariable String admissionFor,
            @RequestParam(required = false) Integer page,
            @RequestParam(required = false) Integer size,
            @RequestParam(defaultValue = "id") String sortBy,
            @RequestParam(defaultValue = "DESC") String direction) {
        if (page != null && size != null) {
            Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.fromString(direction.toUpperCase()), sortBy));
            return ResponseEntity.ok(enquiryService.getEnquiriesByAdmissionPaginated(admissionFor, pageable));
        }
        return ResponseEntity.ok(enquiryRepository.findByAdmissionFor(admissionFor).stream().map(this::convertToDTO).collect(Collectors.toList()));
    }

    @GetMapping("/by-location/{location}")
    public ResponseEntity<?> getEnquiriesByLocation(@PathVariable String location,
            @RequestParam(required = false) Integer page,
            @RequestParam(required = false) Integer size,
            @RequestParam(defaultValue = "id") String sortBy,
            @RequestParam(defaultValue = "DESC") String direction) {
        if (page != null && size != null) {
            Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.fromString(direction.toUpperCase()), sortBy));
            return ResponseEntity.ok(enquiryService.getEnquiriesByLocationPaginated(location, pageable));
        }
        return ResponseEntity.ok(enquiryRepository.findByLocation(location).stream().map(this::convertToDTO).collect(Collectors.toList()));
    }

    @GetMapping("/by-seat/{sscSeatNo}")
    public ResponseEntity<?> getEnquiryBySscSeatNo(@PathVariable String sscSeatNo) {
        if (sscSeatNo == null || sscSeatNo.trim().isEmpty()) {
            return ResponseEntity.badRequest().body("{\"error\": \"SSC Seat No cannot be empty\"}");
        }
        Enquiry enquiry = enquiryRepository.findBySscSeatNoIgnoreCase(sscSeatNo.trim());
        if (enquiry == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("{\"error\": \"No enquiry found with Seat No: " + sscSeatNo + "\"}");
        }
        return ResponseEntity.ok(convertToDTO(enquiry));
    }

    @GetMapping("/provisional")
    public ResponseEntity<?> getProvisionalAdmissions() {
        return ResponseEntity.ok(enquiryRepository.findByProvisionalAdmissionTrue()
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList()));
    }

    private void sendSelectedEnquiryPreset(Enquiry savedEnquiry) {
        if (!savedEnquiry.isEmailEnabled() || savedEnquiry.getSelectedEmailPresetId() == null
                || savedEnquiry.getEmail() == null || savedEnquiry.getEmail().isBlank()) {
            return;
        }
        try {
            EmailPreset preset = emailPresetRepository.findById(savedEnquiry.getSelectedEmailPresetId())
                    .orElseThrow(() -> new IllegalArgumentException("Selected email preset not found"));
            if (!"ENQUIRY".equalsIgnoreCase(preset.getTargetScope())) {
                throw new IllegalArgumentException("Selected preset is not allowed for enquiry email");
            }
            emailService.sendEmail(savedEnquiry.getEmail(), preset.getSubject(), preset.getBody(), parseAttachmentPaths(preset.getAttachmentsJson()));
        } catch (Exception emailError) {
            logger.error("Enquiry created, but preset email failed", emailError);
        }
    }

    private EnquiryResponseDTO convertToDTO(Enquiry enquiry) {
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
        return dto;
    }

    private Enquiry convertToEntity(EnquiryRequestDTO dto) {
        Enquiry enquiry = new Enquiry();
        copyRequestToEntity(dto, enquiry);
        return enquiry;
    }

    private void copyRequestToEntity(EnquiryRequestDTO dto, Enquiry enquiry) {
        enquiry.setFirstName(dto.getFirstName());
        enquiry.setMiddleName(dto.getMiddleName());
        enquiry.setLastName(dto.getLastName());
        enquiry.setPersonalMobileNumber(dto.getPersonalMobileNumber());
        enquiry.setGuardianMobileNumber(dto.getGuardianMobileNumber());
        enquiry.setEmail(dto.getEmail());
        enquiry.setMeritDetails(dto.getMeritDetails());
        enquiry.setAdmissionFor(dto.getAdmissionFor());
        enquiry.setLocation(dto.getLocation());
        enquiry.setOtherLocation(dto.getOtherLocation());
        enquiry.setCategory(dto.getCategory());
        enquiry.setBranchesInterested(dto.getBranchesInterested());
        enquiry.setReferenceFaculty(dto.getReferenceFaculty());
        enquiry.setStatus(dto.getStatus() != null ? dto.getStatus() : "Pending");
        enquiry.setEnquiryDate(dto.getEnquiryDate());
        enquiry.setSscSeatNo(dto.getSscSeatNo());
        enquiry.setDteRegistrationDone(dto.isDteRegistrationDone());
        enquiry.setEmailEnabled(dto.isEmailEnabled());
        enquiry.setSelectedEmailPresetId(dto.getSelectedEmailPresetId());
        enquiry.setProvisionalAdmission(dto.isProvisionalAdmission());
    }

    private List<String> parseAttachmentPaths(String attachmentsJson) {
        if (attachmentsJson == null || attachmentsJson.isBlank()) {
            return List.of();
        }
        try {
            return objectMapper.readValue(attachmentsJson, new TypeReference<List<String>>() {});
        } catch (Exception e) {
            logger.warn("Unable to parse email preset attachments", e);
            return List.of();
        }
    }
}
