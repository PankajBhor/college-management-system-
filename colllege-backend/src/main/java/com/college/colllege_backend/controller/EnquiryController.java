package com.college.colllege_backend.controller;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
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
import org.springframework.web.bind.annotation.RestController;

import com.college.colllege_backend.dto.EnquiryRequestDTO;
import com.college.colllege_backend.dto.EnquiryResponseDTO;
import com.college.colllege_backend.entity.Enquiry;
import com.college.colllege_backend.repository.EnquiryRepository;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/enquiries")
@CrossOrigin(origins = "http://localhost:3000")
public class EnquiryController {

    @Autowired
    private EnquiryRepository enquiryRepository;

    @Autowired
    private com.college.colllege_backend.service.EmailService emailService;

    /**
     * Get all enquiries
     */
    @GetMapping
    public ResponseEntity<List<EnquiryResponseDTO>> getAllEnquiries() {
        List<EnquiryResponseDTO> enquiries = enquiryRepository.findAll()
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
        return ResponseEntity.ok(enquiries);
    }

    /**
     * Get enquiry by ID
     */
    @GetMapping("/{id}")
    public ResponseEntity<?> getEnquiryById(@PathVariable Long id) {
        return enquiryRepository.findById(id)
                .map(enquiry -> ResponseEntity.ok(convertToDTO(enquiry)))
                .orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND).build());
    }

    /**
     * Create new enquiry
     */
    @PostMapping
    public ResponseEntity<?> createEnquiry(@Valid @RequestBody EnquiryRequestDTO request) {
        try {
            Enquiry enquiry = convertToEntity(request);
            Enquiry savedEnquiry = enquiryRepository.save(enquiry);

            // Send fee structure email
            String to = savedEnquiry.getEmail();
            String subject = "Jaihind College – Diploma Engineering Fee Structure (Demo)";
            String body = "🏫 Jaihind College – Diploma Engineering Fee Structure (Demo)\n\n"
                    + "Dear Parent/Student,\n"
                    + "Below is the approximate fee structure for Diploma Engineering courses. The fees are same for all departments (Computer, Mechanical, Civil, Electrical, etc.). Only the year and caste category affect the final payable fees.\n\n"
                    + "📘 1st Year Fees\n"
                    + "Category\tTotal Fees (Approx.)\n"
                    + "OPEN\t₹45,000\n"
                    + "OBC\t₹25,000\n"
                    + "SC / ST\t₹5,000\n"
                    + "EWS\t₹20,000\n"
                    + "📘 2nd Year Fees\n"
                    + "Category\tTotal Fees (Approx.)\n"
                    + "OPEN\t₹42,000\n"
                    + "OBC\t₹22,000\n"
                    + "SC / ST\t₹4,000\n"
                    + "EWS\t₹18,000\n"
                    + "📘 3rd Year Fees\n"
                    + "Category\tTotal Fees (Approx.)\n"
                    + "OPEN\t₹40,000\n"
                    + "OBC\t₹20,000\n"
                    + "SC / ST\t₹3,000\n"
                    + "EWS\t₹16,000\n\n"
                    + "📌 Note:\n"
                    + "• Fees may change according to government rules and scholarships.\n"
                    + "• Additional charges like exam fees, uniform, books, and hostel are separate.\n"
                    + "• Scholarships are available as per government norms.\n\n"
                    + "For more details, please contact the Admission Office.";
            if (to != null && !to.isBlank()) {
                emailService.sendEmail(to, subject, body);
            }

            return ResponseEntity.status(HttpStatus.CREATED).body(convertToDTO(savedEnquiry));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("{\"error\": \"" + e.getMessage() + "\"}");
        }
    }

    /**
     * Update enquiry
     */
    @PutMapping("/{id}")
    public ResponseEntity<?> updateEnquiry(@PathVariable Long id, @Valid @RequestBody EnquiryRequestDTO request) {
        return enquiryRepository.findById(id)
                .map(enquiry -> {
                    // Update fields
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
                    if (request.getStatus() != null) {
                        enquiry.setStatus(request.getStatus());
                    }
                    if (request.getEnquiryDate() != null) {
                        enquiry.setEnquiryDate(request.getEnquiryDate());
                    }

                    Enquiry updatedEnquiry = enquiryRepository.save(enquiry);
                    return ResponseEntity.ok(convertToDTO(updatedEnquiry));
                })
                .orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND).build());
    }

    /**
     * Delete enquiry
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteEnquiry(@PathVariable Long id) {
        if (enquiryRepository.existsById(id)) {
            enquiryRepository.deleteById(id);
            return ResponseEntity.ok().build();
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }

    /**
     * Update enquiry status only
     */
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

    /**
     * Get enquiries by status
     */
    @GetMapping("/by-status/{status}")
    public ResponseEntity<List<EnquiryResponseDTO>> getEnquiriesByStatus(@PathVariable String status) {
        List<EnquiryResponseDTO> enquiries = enquiryRepository.findByStatus(status)
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
        return ResponseEntity.ok(enquiries);
    }

    /**
     * Get enquiries by category
     */
    @GetMapping("/by-category/{category}")
    public ResponseEntity<List<EnquiryResponseDTO>> getEnquiriesByCategory(@PathVariable String category) {
        List<EnquiryResponseDTO> enquiries = enquiryRepository.findByCategory(category)
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
        return ResponseEntity.ok(enquiries);
    }

    /**
     * Get enquiries by admission type
     */
    @GetMapping("/by-admission/{admissionFor}")
    public ResponseEntity<List<EnquiryResponseDTO>> getEnquiriesByAdmission(@PathVariable String admissionFor) {
        List<EnquiryResponseDTO> enquiries = enquiryRepository.findByAdmissionFor(admissionFor)
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
        return ResponseEntity.ok(enquiries);
    }

    /**
     * Get enquiries by location
     */
    @GetMapping("/by-location/{location}")
    public ResponseEntity<List<EnquiryResponseDTO>> getEnquiriesByLocation(@PathVariable String location) {
        List<EnquiryResponseDTO> enquiries = enquiryRepository.findByLocation(location)
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
        return ResponseEntity.ok(enquiries);
    }

    // Helper methods for DTO conversion
    private EnquiryResponseDTO convertToDTO(Enquiry enquiry) {
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
                enquiry.getUpdatedAt(),
                enquiry.isDteRegistrationDone()
        );
    }

    private Enquiry convertToEntity(EnquiryRequestDTO dto) {
        Enquiry enquiry = new Enquiry();
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
        return enquiry;
    }
}
