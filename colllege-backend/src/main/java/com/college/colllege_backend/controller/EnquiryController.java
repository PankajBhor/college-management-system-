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
import com.college.colllege_backend.entity.Enquiry;
import com.college.colllege_backend.repository.EnquiryRepository;
import com.college.colllege_backend.service.impl.EnquiryServiceImpl;

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

    /**
     * Get all enquiries with pagination support
     */
    @GetMapping
    public ResponseEntity<?> getAllEnquiries(
            @RequestParam(required = false) Integer page,
            @RequestParam(required = false) Integer size,
            @RequestParam(defaultValue = "id") String sortBy,
            @RequestParam(defaultValue = "DESC") String direction) {

        // If pagination parameters provided, return paginated response
        if (page != null && size != null) {
            Sort.Direction sortDirection = Sort.Direction.fromString(direction.toUpperCase());
            Pageable pageable = PageRequest.of(page, size, Sort.by(sortDirection, sortBy));
            Page<EnquiryResponseDTO> result = enquiryService.getAllEnquiriesPaginated(pageable);
            return ResponseEntity.ok(result);
        }

        // Otherwise return complete list (backward compatibility)
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
            logger.info("=============== CREATE ENQUIRY ENDPOINT CALLED ===============");
            logger.info("Received enquiry request with email: {}", request.getEmail());

            Enquiry enquiry = convertToEntity(request);
            logger.info("Enquiry entity converted, saving to database...");

            Enquiry savedEnquiry = enquiryRepository.save(enquiry);
            logger.info("Enquiry saved successfully with ID: {}", savedEnquiry.getId());

            // Send fee structure email
            String to = savedEnquiry.getEmail();
            logger.info("Email recipient: {}", to);

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
                try {
                    logger.info(">>> ABOUT TO SEND EMAIL TO: {}", to);
                    emailService.sendEmail(to, subject, body);
                    logger.info(">>> EMAIL SENT SUCCESSFULLY <<<");
                } catch (Exception emailError) {
                    logger.error(">>> EMAIL SEND FAILED <<<");
                    logger.error("Email Error Type: {}", emailError.getClass().getName());
                    logger.error("Email Error Message: {}", emailError.getMessage());
                    logger.error("Full Stack Trace: ", emailError);
                    // Email failure doesn't block enquiry creation
                    logger.warn("Enquiry created successfully, but email notification failed");
                }
            } else {
                logger.warn("No email address provided, skipping email send");
            }

            logger.info("=============== RETURNING SUCCESS RESPONSE ===============");
            return ResponseEntity.status(HttpStatus.CREATED).body(convertToDTO(savedEnquiry));
        } catch (Exception e) {
            logger.error("=============== CREATE ENQUIRY FAILED ===============");
            logger.error("Exception Type: {}", e.getClass().getName());
            logger.error("Exception Message: {}", e.getMessage());
            logger.error("Full Stack Trace: ", e);
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
                    enquiry.setSscSeatNo(request.getSscSeatNo());
                    enquiry.setDteRegistrationDone(request.isDteRegistrationDone());
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
     * Get enquiries by status with pagination support
     */
    @GetMapping("/by-status/{status}")
    public ResponseEntity<?> getEnquiriesByStatus(
            @PathVariable String status,
            @RequestParam(required = false) Integer page,
            @RequestParam(required = false) Integer size,
            @RequestParam(defaultValue = "id") String sortBy,
            @RequestParam(defaultValue = "DESC") String direction) {

        // If pagination parameters provided, return paginated response
        if (page != null && size != null) {
            Sort.Direction sortDirection = Sort.Direction.fromString(direction.toUpperCase());
            Pageable pageable = PageRequest.of(page, size, Sort.by(sortDirection, sortBy));
            Page<EnquiryResponseDTO> result = enquiryService.getEnquiriesByStatusPaginated(status, pageable);
            return ResponseEntity.ok(result);
        }

        // Otherwise return complete list (backward compatibility)
        List<EnquiryResponseDTO> enquiries = enquiryRepository.findByStatus(status)
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
        return ResponseEntity.ok(enquiries);
    }

    /**
     * Get enquiries by category with pagination support
     */
    @GetMapping("/by-category/{category}")
    public ResponseEntity<?> getEnquiriesByCategory(
            @PathVariable String category,
            @RequestParam(required = false) Integer page,
            @RequestParam(required = false) Integer size,
            @RequestParam(defaultValue = "id") String sortBy,
            @RequestParam(defaultValue = "DESC") String direction) {

        // If pagination parameters provided, return paginated response
        if (page != null && size != null) {
            Sort.Direction sortDirection = Sort.Direction.fromString(direction.toUpperCase());
            Pageable pageable = PageRequest.of(page, size, Sort.by(sortDirection, sortBy));
            Page<EnquiryResponseDTO> result = enquiryService.getEnquiriesByCategoryPaginated(category, pageable);
            return ResponseEntity.ok(result);
        }

        // Otherwise return complete list (backward compatibility)
        List<EnquiryResponseDTO> enquiries = enquiryRepository.findByCategory(category)
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
        return ResponseEntity.ok(enquiries);
    }

    /**
     * Get enquiries by admission type with pagination support
     */
    @GetMapping("/by-admission/{admissionFor}")
    public ResponseEntity<?> getEnquiriesByAdmission(
            @PathVariable String admissionFor,
            @RequestParam(required = false) Integer page,
            @RequestParam(required = false) Integer size,
            @RequestParam(defaultValue = "id") String sortBy,
            @RequestParam(defaultValue = "DESC") String direction) {

        // If pagination parameters provided, return paginated response
        if (page != null && size != null) {
            Sort.Direction sortDirection = Sort.Direction.fromString(direction.toUpperCase());
            Pageable pageable = PageRequest.of(page, size, Sort.by(sortDirection, sortBy));
            Page<EnquiryResponseDTO> result = enquiryService.getEnquiriesByAdmissionPaginated(admissionFor, pageable);
            return ResponseEntity.ok(result);
        }

        // Otherwise return complete list (backward compatibility)
        List<EnquiryResponseDTO> enquiries = enquiryRepository.findByAdmissionFor(admissionFor)
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
        return ResponseEntity.ok(enquiries);
    }

    /**
     * Get enquiries by location with pagination support
     */
    @GetMapping("/by-location/{location}")
    public ResponseEntity<?> getEnquiriesByLocation(
            @PathVariable String location,
            @RequestParam(required = false) Integer page,
            @RequestParam(required = false) Integer size,
            @RequestParam(defaultValue = "id") String sortBy,
            @RequestParam(defaultValue = "DESC") String direction) {

        // If pagination parameters provided, return paginated response
        if (page != null && size != null) {
            Sort.Direction sortDirection = Sort.Direction.fromString(direction.toUpperCase());
            Pageable pageable = PageRequest.of(page, size, Sort.by(sortDirection, sortBy));
            Page<EnquiryResponseDTO> result = enquiryService.getEnquiriesByLocationPaginated(location, pageable);
            return ResponseEntity.ok(result);
        }

        // Otherwise return complete list (backward compatibility)
        List<EnquiryResponseDTO> enquiries = enquiryRepository.findByLocation(location)
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
        return ResponseEntity.ok(enquiries);
    }

    /**
     * Get enquiry by SSC Seat No
     */
    @GetMapping("/by-seat/{sscSeatNo}")
    public ResponseEntity<?> getEnquiryBySscSeatNo(@PathVariable String sscSeatNo) {
        try {
            if (sscSeatNo == null || sscSeatNo.trim().isEmpty()) {
                return ResponseEntity.badRequest()
                        .body("{\"error\": \"SSC Seat No cannot be empty\"}");
            }

            Enquiry enquiry = enquiryRepository.findBySscSeatNoIgnoreCase(sscSeatNo.trim());
            if (enquiry != null) {
                return ResponseEntity.ok(convertToDTO(enquiry));
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body("{\"error\": \"No enquiry found with Seat No: " + sscSeatNo + "\"}");
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("{\"error\": \"Error searching enquiry: " + e.getMessage() + "\"}");
        }
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
                enquiry.isDteRegistrationDone(),
                enquiry.getSscSeatNo()
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
        enquiry.setSscSeatNo(dto.getSscSeatNo());
        enquiry.setDteRegistrationDone(dto.isDteRegistrationDone());
        return enquiry;
    }
}
