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
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
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
import com.college.colllege_backend.service.AdmissionPdfService;
import com.college.colllege_backend.service.BulkUploadService;
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
    private AdmissionPdfService admissionPdfService;

    @Autowired
    private BulkUploadService bulkUploadService;

    @PostMapping
    public ResponseEntity<?> createFYAdmission(
            @Valid @ModelAttribute FYAdmissionRequestDTO request,
            @RequestPart(value = "domicileCertificate", required = false) MultipartFile domicileCertificate,
            @RequestPart(value = "tenthMarkSheet", required = false) MultipartFile tenthMarkSheet,
            @RequestPart(value = "twelfthMarkSheet", required = false) MultipartFile twelfthMarkSheet,
            @RequestPart(value = "leavingCertificate", required = false) MultipartFile leavingCertificate,
            @RequestPart(value = "casteCertificate", required = false) MultipartFile casteCertificate,
            @RequestPart(value = "nonCreamyLayerCertificate", required = false) MultipartFile nonCreamyLayerCertificate,
            @RequestPart(value = "incomeCertificate", required = false) MultipartFile incomeCertificate,
            @RequestPart(value = "defenceCertificate", required = false) MultipartFile defenceCertificate,
            @RequestPart(value = "aadhaarCard", required = false) MultipartFile aadhaarCard,
            @RequestPart(value = "anyOther", required = false) MultipartFile anyOther,
            @RequestPart(value = "studentPhoto", required = false) MultipartFile studentPhoto,
            @RequestPart(value = "undertakingForm", required = false) MultipartFile undertakingForm) {
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
            if (studentPhoto != null && !studentPhoto.isEmpty()) {
                String filePath = fileStorageService.saveFile(studentPhoto, "FY", admission.getId().toString());
                request.setStudentPhotoPath(filePath);
            }
            if (undertakingForm != null && !undertakingForm.isEmpty()) {
                String filePath = fileStorageService.saveFile(undertakingForm, "FY", admission.getId().toString());
                request.setUndertakingFormPath(filePath);
            }

            // Update admission with document paths
            FYAdmission updatedAdmission = fyAdmissionService.updateFYAdmission(admission.getId(), request);
            return ResponseEntity.status(HttpStatus.CREATED).body(updatedAdmission);
        } catch (IllegalArgumentException e) {
            logger.warn("Create FY admission failed: {}", e.getMessage());
            return ResponseEntity.badRequest().body(java.util.Map.of("error", e.getMessage()));
        } catch (Exception e) {
            logger.error("Create FY admission failed", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(java.util.Map.of("error", "Unable to create FY admission"));
        }
    }

    @PostMapping(value = "/bulk-upload", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> bulkUploadFYAdmissions(@RequestParam("file") MultipartFile file) {
        return ResponseEntity.ok(bulkUploadService.uploadFYAdmissions(file));
    }

    @GetMapping("/bulk-upload/template")
    public ResponseEntity<byte[]> downloadBulkUploadTemplate() {
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"fy-admission-bulk-upload-template.xlsx\"")
                .contentType(MediaType.parseMediaType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"))
                .body(bulkUploadService.fyAdmissionTemplate());
    }

    @GetMapping("/{id}")
    public ResponseEntity<FYAdmission> getFYAdmissionById(@PathVariable Long id) {
        FYAdmission admission = fyAdmissionService.getFYAdmissionById(id);
        return ResponseEntity.ok(admission);
    }

    @GetMapping(value = "/{id}/admission-form.pdf", produces = MediaType.APPLICATION_PDF_VALUE)
    public ResponseEntity<byte[]> downloadAdmissionFormPdf(@PathVariable Long id) {
        FYAdmission admission = fyAdmissionService.getFYAdmissionById(id);
        byte[] pdf = admissionPdfService.generateFYAdmissionForm(admission);
        String fileName = "FY_Admission_Form_" + id + ".pdf";
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + fileName + "\"")
                .contentType(MediaType.APPLICATION_PDF)
                .body(pdf);
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

    @PutMapping(value = "/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> updateFYAdmissionWithDocuments(
            @PathVariable Long id,
            @Valid @ModelAttribute FYAdmissionRequestDTO request,
            @RequestPart(value = "domicileCertificate", required = false) MultipartFile domicileCertificate,
            @RequestPart(value = "tenthMarkSheet", required = false) MultipartFile tenthMarkSheet,
            @RequestPart(value = "twelfthMarkSheet", required = false) MultipartFile twelfthMarkSheet,
            @RequestPart(value = "leavingCertificate", required = false) MultipartFile leavingCertificate,
            @RequestPart(value = "casteCertificate", required = false) MultipartFile casteCertificate,
            @RequestPart(value = "nonCreamyLayerCertificate", required = false) MultipartFile nonCreamyLayerCertificate,
            @RequestPart(value = "incomeCertificate", required = false) MultipartFile incomeCertificate,
            @RequestPart(value = "defenceCertificate", required = false) MultipartFile defenceCertificate,
            @RequestPart(value = "aadhaarCard", required = false) MultipartFile aadhaarCard,
            @RequestPart(value = "anyOther", required = false) MultipartFile anyOther,
            @RequestPart(value = "studentPhoto", required = false) MultipartFile studentPhoto,
            @RequestPart(value = "undertakingForm", required = false) MultipartFile undertakingForm) {
        FYAdmission existing = fyAdmissionService.getFYAdmissionById(id);
        request.setDomicileCertificatePath(existing.getDomicileCertificatePath());
        request.setTenthMarkSheetPath(existing.getTenthMarkSheetPath());
        request.setTwelfthMarkSheetPath(existing.getTwelfthMarkSheetPath());
        request.setLeavingCertificatePath(existing.getLeavingCertificatePath());
        request.setCasteCertificatePath(existing.getCasteCertificatePath());
        request.setNonCreamyLayerCertificatePath(existing.getNonCreamyLayerCertificatePath());
        request.setIncomeCertificatePath(existing.getIncomeCertificatePath());
        request.setDefenceCertificatePath(existing.getDefenceCertificatePath());
        request.setAadhaarCardPath(existing.getAadhaarCardPath());
        request.setAnyOtherDocumentPath(existing.getAnyOtherDocumentPath());
        request.setStudentPhotoPath(existing.getStudentPhotoPath());
        request.setUndertakingFormPath(existing.getUndertakingFormPath());
        try {
            if (domicileCertificate != null && !domicileCertificate.isEmpty()) request.setDomicileCertificatePath(fileStorageService.saveFile(domicileCertificate, "FY", id.toString()));
            if (tenthMarkSheet != null && !tenthMarkSheet.isEmpty()) request.setTenthMarkSheetPath(fileStorageService.saveFile(tenthMarkSheet, "FY", id.toString()));
            if (twelfthMarkSheet != null && !twelfthMarkSheet.isEmpty()) request.setTwelfthMarkSheetPath(fileStorageService.saveFile(twelfthMarkSheet, "FY", id.toString()));
            if (leavingCertificate != null && !leavingCertificate.isEmpty()) request.setLeavingCertificatePath(fileStorageService.saveFile(leavingCertificate, "FY", id.toString()));
            if (casteCertificate != null && !casteCertificate.isEmpty()) request.setCasteCertificatePath(fileStorageService.saveFile(casteCertificate, "FY", id.toString()));
            if (nonCreamyLayerCertificate != null && !nonCreamyLayerCertificate.isEmpty()) request.setNonCreamyLayerCertificatePath(fileStorageService.saveFile(nonCreamyLayerCertificate, "FY", id.toString()));
            if (incomeCertificate != null && !incomeCertificate.isEmpty()) request.setIncomeCertificatePath(fileStorageService.saveFile(incomeCertificate, "FY", id.toString()));
            if (defenceCertificate != null && !defenceCertificate.isEmpty()) request.setDefenceCertificatePath(fileStorageService.saveFile(defenceCertificate, "FY", id.toString()));
            if (aadhaarCard != null && !aadhaarCard.isEmpty()) request.setAadhaarCardPath(fileStorageService.saveFile(aadhaarCard, "FY", id.toString()));
            if (anyOther != null && !anyOther.isEmpty()) request.setAnyOtherDocumentPath(fileStorageService.saveFile(anyOther, "FY", id.toString()));
            if (studentPhoto != null && !studentPhoto.isEmpty()) request.setStudentPhotoPath(fileStorageService.saveFile(studentPhoto, "FY", id.toString()));
            if (undertakingForm != null && !undertakingForm.isEmpty()) request.setUndertakingFormPath(fileStorageService.saveFile(undertakingForm, "FY", id.toString()));
            return ResponseEntity.ok(fyAdmissionService.updateFYAdmission(id, request));
        } catch (IllegalArgumentException e) {
            logger.warn("Update FY admission documents failed: {}", e.getMessage());
            return ResponseEntity.badRequest().body(java.util.Map.of("error", e.getMessage()));
        } catch (Exception e) {
            logger.error("Update FY admission documents failed", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(java.util.Map.of("error", "Unable to update FY admission documents"));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteFYAdmission(@PathVariable Long id) {
        fyAdmissionService.deleteFYAdmission(id);
        return ResponseEntity.noContent().build();
    }
}
