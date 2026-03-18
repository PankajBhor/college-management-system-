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

import com.college.colllege_backend.dto.FYAdmissionRequestDTO;
import com.college.colllege_backend.entity.FYAdmission;
import com.college.colllege_backend.service.FYAdmissionService;
import com.college.colllege_backend.service.FileStorageService;
import com.college.colllege_backend.service.impl.FYAdmissionServiceImpl;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/admissions/fy")
@CrossOrigin(origins = "http://localhost:3000")
public class FYAdmissionController {

    private static final Logger logger = LoggerFactory.getLogger(FYAdmissionController.class);

    @Autowired
    private FYAdmissionService fyAdmissionService;

    @Autowired
    private FYAdmissionServiceImpl fyAdmissionServiceImpl;

    @Autowired
    private FileStorageService fileStorageService;

    @Autowired
    private com.college.colllege_backend.service.EmailService emailService;

    @PostMapping
    public ResponseEntity<FYAdmission> createFYAdmission(
            @ModelAttribute FYAdmissionRequestDTO request,
            @RequestPart(value = "domicileCertificate", required = false) MultipartFile domicileCertificate,
            @RequestPart(value = "tenthMarkSheet", required = false) MultipartFile tenthMarkSheet,
            @RequestPart(value = "twelfthMarkSheet", required = false) MultipartFile twelfthMarkSheet,
            @RequestPart(value = "leavingCertificate", required = false) MultipartFile leavingCertificate,
            @RequestPart(value = "casteCertificate", required = false) MultipartFile casteCertificate,
            @RequestPart(value = "nonCreamyLayerCertificate", required = false) MultipartFile nonCreamyLayerCertificate,
            @RequestPart(value = "incomeCertificate", required = false) MultipartFile incomeCertificate,
            @RequestPart(value = "defenceCertificate", required = false) MultipartFile defenceCertificate,
            @RequestPart(value = "aadhaarCard", required = false) MultipartFile aadhaarCard,
            @RequestPart(value = "anyOther", required = false) MultipartFile anyOther) {
        try {
            // Create admission first to get the ID for file storage
            FYAdmission admission = fyAdmissionService.createFYAdmission(request);

            // Process and save documents
            if (domicileCertificate != null && !domicileCertificate.isEmpty()) {
                String filePath = fileStorageService.saveFile(domicileCertificate, "FY", admission.getId().toString());
                request.setDomicileCertificatePath(filePath);
            }
            if (tenthMarkSheet != null && !tenthMarkSheet.isEmpty()) {
                String filePath = fileStorageService.saveFile(tenthMarkSheet, "FY", admission.getId().toString());
                request.setTenthMarkSheetPath(filePath);
            }
            if (twelfthMarkSheet != null && !twelfthMarkSheet.isEmpty()) {
                String filePath = fileStorageService.saveFile(twelfthMarkSheet, "FY", admission.getId().toString());
                request.setTwelfthMarkSheetPath(filePath);
            }
            if (leavingCertificate != null && !leavingCertificate.isEmpty()) {
                String filePath = fileStorageService.saveFile(leavingCertificate, "FY", admission.getId().toString());
                request.setLeavingCertificatePath(filePath);
            }
            if (casteCertificate != null && !casteCertificate.isEmpty()) {
                String filePath = fileStorageService.saveFile(casteCertificate, "FY", admission.getId().toString());
                request.setCasteCertificatePath(filePath);
            }
            if (nonCreamyLayerCertificate != null && !nonCreamyLayerCertificate.isEmpty()) {
                String filePath = fileStorageService.saveFile(nonCreamyLayerCertificate, "FY", admission.getId().toString());
                request.setNonCreamyLayerCertificatePath(filePath);
            }
            if (incomeCertificate != null && !incomeCertificate.isEmpty()) {
                String filePath = fileStorageService.saveFile(incomeCertificate, "FY", admission.getId().toString());
                request.setIncomeCertificatePath(filePath);
            }
            if (defenceCertificate != null && !defenceCertificate.isEmpty()) {
                String filePath = fileStorageService.saveFile(defenceCertificate, "FY", admission.getId().toString());
                request.setDefenceCertificatePath(filePath);
            }
            if (aadhaarCard != null && !aadhaarCard.isEmpty()) {
                String filePath = fileStorageService.saveFile(aadhaarCard, "FY", admission.getId().toString());
                request.setAadhaarCardPath(filePath);
            }
            if (anyOther != null && !anyOther.isEmpty()) {
                String filePath = fileStorageService.saveFile(anyOther, "FY", admission.getId().toString());
                request.setAnyOtherDocumentPath(filePath);
            }

            // Update admission with document paths
            FYAdmission updatedAdmission = fyAdmissionService.updateFYAdmission(admission.getId(), request);

            // Send seat confirmation email
            String to = updatedAdmission.getStudentEmail();
            if (to != null && !to.isBlank()) {
                try {
                    logger.info(">>> FY ADMISSION: ABOUT TO SEND SEAT CONFIRMATION EMAIL TO: {}", to);
                    String subject = "🎉 Seat Confirmation - Jaihind College - First Year (FY) Admission";
                    String body = "🎉 Congratulations! Seat Confirmation - Jaihind College\n\n"
                            + "Dear " + updatedAdmission.getApplicantFirstName() + " " + updatedAdmission.getApplicantLastName() + ",\n\n"
                            + "We are delighted to inform you that your seat has been confirmed for First Year (FY) Diploma Engineering Program at Jaihind College.\n\n"
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
                    logger.info(">>> FY ADMISSION: SEAT CONFIRMATION EMAIL SENT SUCCESSFULLY <<<");
                } catch (Exception emailError) {
                    logger.error(">>> FY ADMISSION: EMAIL SEND FAILED <<<");
                    logger.error("Email Error Type: {}", emailError.getClass().getName());
                    logger.error("Email Error Message: {}", emailError.getMessage());
                    logger.warn("FY Admission created successfully, but email notification failed");
                }
            } else {
                logger.warn("No email address provided for FY admission, skipping email notification");
            }

            return ResponseEntity.status(HttpStatus.CREATED).body(updatedAdmission);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<FYAdmission> getFYAdmissionById(@PathVariable Long id) {
        FYAdmission admission = fyAdmissionService.getFYAdmissionById(id);
        return ResponseEntity.ok(admission);
    }

    @GetMapping
    public ResponseEntity<?> getAllFYAdmissions(
            @RequestParam(required = false) Integer page,
            @RequestParam(required = false) Integer size,
            @RequestParam(defaultValue = "id") String sortBy,
            @RequestParam(defaultValue = "DESC") String direction) {

        // If pagination parameters provided, return paginated response
        if (page != null && size != null) {
            Sort.Direction sortDirection = Sort.Direction.fromString(direction.toUpperCase());
            Pageable pageable = PageRequest.of(page, size, Sort.by(sortDirection, sortBy));
            Page<FYAdmission> result = fyAdmissionServiceImpl.getAllFYAdmissionsPaginated(pageable);
            return ResponseEntity.ok(result);
        }

        // Otherwise return complete list (backward compatibility)
        List<FYAdmission> admissions = fyAdmissionService.getAllFYAdmissions();
        return ResponseEntity.ok(admissions);
    }

    @GetMapping("/status/{status}")
    public ResponseEntity<?> getFYAdmissionsByStatus(
            @PathVariable String status,
            @RequestParam(required = false) Integer page,
            @RequestParam(required = false) Integer size,
            @RequestParam(defaultValue = "id") String sortBy,
            @RequestParam(defaultValue = "DESC") String direction) {

        // If pagination parameters provided, return paginated response
        if (page != null && size != null) {
            Sort.Direction sortDirection = Sort.Direction.fromString(direction.toUpperCase());
            Pageable pageable = PageRequest.of(page, size, Sort.by(sortDirection, sortBy));
            Page<FYAdmission> result = fyAdmissionServiceImpl.getFYAdmissionsByStatusPaginated(status, pageable);
            return ResponseEntity.ok(result);
        }

        // Otherwise return complete list (backward compatibility)
        List<FYAdmission> admissions = fyAdmissionService.getFYAdmissionsByStatus(status);
        return ResponseEntity.ok(admissions);
    }

    @GetMapping("/admission-type/{admissionType}")
    public ResponseEntity<?> getFYAdmissionsByAdmissionType(
            @PathVariable String admissionType,
            @RequestParam(required = false) Integer page,
            @RequestParam(required = false) Integer size,
            @RequestParam(defaultValue = "id") String sortBy,
            @RequestParam(defaultValue = "DESC") String direction) {

        // If pagination parameters provided, return paginated response
        if (page != null && size != null) {
            Sort.Direction sortDirection = Sort.Direction.fromString(direction.toUpperCase());
            Pageable pageable = PageRequest.of(page, size, Sort.by(sortDirection, sortBy));
            Page<FYAdmission> result = fyAdmissionServiceImpl.getFYAdmissionsByAdmissionTypePaginated(admissionType, pageable);
            return ResponseEntity.ok(result);
        }

        // Otherwise return complete list (backward compatibility)
        List<FYAdmission> admissions = fyAdmissionService.getFYAdmissionsByAdmissionType(admissionType);
        return ResponseEntity.ok(admissions);
    }

    @PutMapping("/{id}")
    public ResponseEntity<FYAdmission> updateFYAdmission(
            @PathVariable Long id,
            @Valid @RequestBody FYAdmissionRequestDTO request) {
        FYAdmission admission = fyAdmissionService.updateFYAdmission(id, request);
        return ResponseEntity.ok(admission);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteFYAdmission(@PathVariable Long id) {
        fyAdmissionService.deleteFYAdmission(id);
        return ResponseEntity.noContent().build();
    }
}
