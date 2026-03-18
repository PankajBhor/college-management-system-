package com.college.colllege_backend.controller;

import java.util.List;

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
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.college.colllege_backend.dto.DSYAdmissionRequestDTO;
import com.college.colllege_backend.entity.DSYAdmission;
import com.college.colllege_backend.service.DSYAdmissionService;
import com.college.colllege_backend.service.FileStorageService;
import com.college.colllege_backend.service.impl.DSYAdmissionServiceImpl;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/admissions/dsy")
@CrossOrigin(origins = "http://localhost:3000")
public class DSYAdmissionController {

    private static final Logger logger = LoggerFactory.getLogger(DSYAdmissionController.class);

    @Autowired
    private DSYAdmissionService dsyAdmissionService;

    @Autowired
    private DSYAdmissionServiceImpl dsyAdmissionServiceImpl;

    @Autowired
    private FileStorageService fileStorageService;

    @Autowired
    private com.college.colllege_backend.service.EmailService emailService;

    @PostMapping
    public ResponseEntity<DSYAdmission> createDSYAdmission(
            @ModelAttribute DSYAdmissionRequestDTO request,
            @RequestPart(value = "domicileCertificate", required = false) MultipartFile domicileCertificate,
            @RequestPart(value = "sscMarkSheet", required = false) MultipartFile sscMarkSheet,
            @RequestPart(value = "hscMarkSheet", required = false) MultipartFile hscMarkSheet,
            @RequestPart(value = "casteCertificate", required = false) MultipartFile casteCertificate,
            @RequestPart(value = "nonCreamyLayerCertificate", required = false) MultipartFile nonCreamyLayerCertificate,
            @RequestPart(value = "aadhaarCard", required = false) MultipartFile aadhaarCard) {
        try {
            // Create admission first to get the ID for file storage
            DSYAdmission admission = dsyAdmissionService.createDSYAdmission(request);

            // Process and save documents
            if (domicileCertificate != null && !domicileCertificate.isEmpty()) {
                String filePath = fileStorageService.saveFile(domicileCertificate, "DSY", admission.getId().toString());
                request.setDomicileCertificatePath(filePath);
            }
            if (sscMarkSheet != null && !sscMarkSheet.isEmpty()) {
                String filePath = fileStorageService.saveFile(sscMarkSheet, "DSY", admission.getId().toString());
                request.setSscMarkSheetPath(filePath);
            }
            if (hscMarkSheet != null && !hscMarkSheet.isEmpty()) {
                String filePath = fileStorageService.saveFile(hscMarkSheet, "DSY", admission.getId().toString());
                request.setHscMarkSheetPath(filePath);
            }
            if (casteCertificate != null && !casteCertificate.isEmpty()) {
                String filePath = fileStorageService.saveFile(casteCertificate, "DSY", admission.getId().toString());
                request.setCasteCertificatePath(filePath);
            }
            if (nonCreamyLayerCertificate != null && !nonCreamyLayerCertificate.isEmpty()) {
                String filePath = fileStorageService.saveFile(nonCreamyLayerCertificate, "DSY", admission.getId().toString());
                request.setNonCreamyLayerCertificatePath(filePath);
            }
            if (aadhaarCard != null && !aadhaarCard.isEmpty()) {
                String filePath = fileStorageService.saveFile(aadhaarCard, "DSY", admission.getId().toString());
                request.setAadhaarCardPath(filePath);
            }

            // Update admission with document paths
            DSYAdmission updatedAdmission = dsyAdmissionService.updateDSYAdmission(admission.getId(), request);

            // Send seat confirmation email
            String to = updatedAdmission.getStudentEmail();
            if (to != null && !to.isBlank()) {
                try {
                    logger.info(">>> DSY ADMISSION: ABOUT TO SEND SEAT CONFIRMATION EMAIL TO: {}", to);
                    String subject = "🎉 Seat Confirmation - Jaihind College - Direct Second Year (DSY) Admission";
                    String body = "🎉 Congratulations! Seat Confirmation - Jaihind College\n\n"
                            + "Dear " + updatedAdmission.getApplicantFirstName() + " " + updatedAdmission.getApplicantLastName() + ",\n\n"
                            + "We are delighted to inform you that your seat has been confirmed for Direct Second Year (DSY) Diploma Engineering Program at Jaihind College.\n\n"
                            + "📋 Your Admission Details:\n"
                            + "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n"
                            + "Name: " + updatedAdmission.getApplicantFirstName() + " " + updatedAdmission.getApplicantLastName() + "\n"
                            + "Email: " + updatedAdmission.getStudentEmail() + "\n"
                            + "Mobile: " + updatedAdmission.getMobileNo() + "\n"
                            + "Program: " + updatedAdmission.getProgram() + "\n"
                            + "Admission Type: " + updatedAdmission.getAdmissionType() + "\n"
                            + "Category: " + updatedAdmission.getCategory() + "\n"
                            + "Admission Status: " + updatedAdmission.getStatus() + "\n"
                            + "Admission Date: " + updatedAdmission.getCreatedAt() + "\n"
                            + "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n"
                            + "📌 Next Steps:\n"
                            + "1. Complete all pending document submissions\n"
                            + "2. Report to the college on the specified date\n"
                            + "3. Complete fee payment as per the fee structure\n"
                            + "4. Collect your ID card and admission documents\n\n"
                            + "⏰ Important Dates:\n"
                            + "• Admission Deadline: As per college notification\n"
                            + "• Classes Start: As per college calendar\n"
                            + "• Fee Payment: Within 7 days of admission confirmation\n\n"
                            + "📞 Contact Information:\n"
                            + "Admission Office, Jaihind College\n"
                            + "Phone: [College Contact Number]\n"
                            + "Email: admissions@jaihind.edu.in\n"
                            + "Office Hours: Monday to Friday, 9:00 AM - 5:00 PM\n\n"
                            + "Thank you for choosing Jaihind College. We look forward to welcoming you to our institution.\n\n"
                            + "Best Regards,\n"
                            + "Admissions Team\n"
                            + "Jaihind College";

                    emailService.sendEmail(to, subject, body);
                    logger.info(">>> DSY ADMISSION: SEAT CONFIRMATION EMAIL SENT SUCCESSFULLY <<<");
                } catch (Exception emailError) {
                    logger.error(">>> DSY ADMISSION: EMAIL SEND FAILED <<<");
                    logger.error("Email Error Type: {}", emailError.getClass().getName());
                    logger.error("Email Error Message: {}", emailError.getMessage());
                    logger.warn("DSY Admission created successfully, but email notification failed");
                }
            } else {
                logger.warn("No email address provided for DSY admission, skipping email notification");
            }

            return ResponseEntity.status(HttpStatus.CREATED).body(updatedAdmission);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<DSYAdmission> getDSYAdmissionById(@PathVariable Long id) {
        DSYAdmission admission = dsyAdmissionService.getDSYAdmissionById(id);
        return ResponseEntity.ok(admission);
    }

    @GetMapping
    public ResponseEntity<?> getAllDSYAdmissions(
            @RequestParam(required = false) Integer page,
            @RequestParam(required = false) Integer size,
            @RequestParam(defaultValue = "id") String sortBy,
            @RequestParam(defaultValue = "DESC") String direction) {

        // If pagination parameters provided, return paginated response
        if (page != null && size != null) {
            Sort.Direction sortDirection = Sort.Direction.fromString(direction.toUpperCase());
            Pageable pageable = PageRequest.of(page, size, Sort.by(sortDirection, sortBy));
            Page<DSYAdmission> result = dsyAdmissionServiceImpl.getAllDSYAdmissionsPaginated(pageable);
            return ResponseEntity.ok(result);
        }

        // Otherwise return complete list (backward compatibility)
        List<DSYAdmission> admissions = dsyAdmissionService.getAllDSYAdmissions();
        return ResponseEntity.ok(admissions);
    }

    @GetMapping("/status/{status}")
    public ResponseEntity<?> getDSYAdmissionsByStatus(
            @PathVariable String status,
            @RequestParam(required = false) Integer page,
            @RequestParam(required = false) Integer size,
            @RequestParam(defaultValue = "id") String sortBy,
            @RequestParam(defaultValue = "DESC") String direction) {

        // If pagination parameters provided, return paginated response
        if (page != null && size != null) {
            Sort.Direction sortDirection = Sort.Direction.fromString(direction.toUpperCase());
            Pageable pageable = PageRequest.of(page, size, Sort.by(sortDirection, sortBy));
            Page<DSYAdmission> result = dsyAdmissionServiceImpl.getDSYAdmissionsByStatusPaginated(status, pageable);
            return ResponseEntity.ok(result);
        }

        // Otherwise return complete list (backward compatibility)
        List<DSYAdmission> admissions = dsyAdmissionService.getDSYAdmissionsByStatus(status);
        return ResponseEntity.ok(admissions);
    }

    @GetMapping("/admission-type/{admissionType}")
    public ResponseEntity<?> getDSYAdmissionsByAdmissionType(
            @PathVariable String admissionType,
            @RequestParam(required = false) Integer page,
            @RequestParam(required = false) Integer size,
            @RequestParam(defaultValue = "id") String sortBy,
            @RequestParam(defaultValue = "DESC") String direction) {

        // If pagination parameters provided, return paginated response
        if (page != null && size != null) {
            Sort.Direction sortDirection = Sort.Direction.fromString(direction.toUpperCase());
            Pageable pageable = PageRequest.of(page, size, Sort.by(sortDirection, sortBy));
            Page<DSYAdmission> result = dsyAdmissionServiceImpl.getDSYAdmissionsByAdmissionTypePaginated(admissionType, pageable);
            return ResponseEntity.ok(result);
        }

        // Otherwise return complete list (backward compatibility)
        List<DSYAdmission> admissions = dsyAdmissionService.getDSYAdmissionsByAdmissionType(admissionType);
        return ResponseEntity.ok(admissions);
    }

    @PutMapping("/{id}")
    public ResponseEntity<DSYAdmission> updateDSYAdmission(
            @PathVariable Long id,
            @Valid @RequestBody DSYAdmissionRequestDTO request) {
        DSYAdmission admission = dsyAdmissionService.updateDSYAdmission(id, request);
        return ResponseEntity.ok(admission);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteDSYAdmission(@PathVariable Long id) {
        dsyAdmissionService.deleteDSYAdmission(id);
        return ResponseEntity.noContent().build();
    }
}
