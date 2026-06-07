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

import com.college.colllege_backend.dto.DSYAdmissionRequestDTO;
import com.college.colllege_backend.entity.DSYAdmission;
import com.college.colllege_backend.service.AdmissionPdfService;
import com.college.colllege_backend.service.BulkUploadService;
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
    private AdmissionPdfService admissionPdfService;

    @Autowired
    private BulkUploadService bulkUploadService;

    @PostMapping
    public ResponseEntity<?> createDSYAdmission(
            @Valid @ModelAttribute DSYAdmissionRequestDTO request,
            @RequestPart(value = "domicileCertificate", required = false) MultipartFile domicileCertificate,
            @RequestPart(value = "sscMarkSheet", required = false) MultipartFile sscMarkSheet,
            @RequestPart(value = "hscMarkSheet", required = false) MultipartFile hscMarkSheet,
            @RequestPart(value = "casteCertificate", required = false) MultipartFile casteCertificate,
            @RequestPart(value = "nonCreamyLayerCertificate", required = false) MultipartFile nonCreamyLayerCertificate,
            @RequestPart(value = "aadhaarCard", required = false) MultipartFile aadhaarCard,
            @RequestPart(value = "studentPhoto", required = false) MultipartFile studentPhoto,
            @RequestPart(value = "undertakingForm", required = false) MultipartFile undertakingForm) {
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
            if (studentPhoto != null && !studentPhoto.isEmpty()) {
                String filePath = fileStorageService.saveFile(studentPhoto, "DSY", admission.getId().toString());
                request.setStudentPhotoPath(filePath);
            }
            if (undertakingForm != null && !undertakingForm.isEmpty()) {
                String filePath = fileStorageService.saveFile(undertakingForm, "DSY", admission.getId().toString());
                request.setUndertakingFormPath(filePath);
            }

            // Update admission with document paths
            DSYAdmission updatedAdmission = dsyAdmissionService.updateDSYAdmission(admission.getId(), request);
            return ResponseEntity.status(HttpStatus.CREATED).body(updatedAdmission);
        } catch (IllegalArgumentException e) {
            logger.warn("Create DSY admission failed: {}", e.getMessage());
            return ResponseEntity.badRequest().body(java.util.Map.of("error", e.getMessage()));
        } catch (Exception e) {
            logger.error("Create DSY admission failed", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(java.util.Map.of("error", "Unable to create DSY admission"));
        }
    }

    @PostMapping(value = "/bulk-upload", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> bulkUploadDSYAdmissions(@RequestParam("file") MultipartFile file) {
        return ResponseEntity.ok(bulkUploadService.uploadDSYAdmissions(file));
    }

    @GetMapping("/bulk-upload/template")
    public ResponseEntity<byte[]> downloadBulkUploadTemplate() {
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"dsy-admission-bulk-upload-template.xlsx\"")
                .contentType(MediaType.parseMediaType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"))
                .body(bulkUploadService.dsyAdmissionTemplate());
    }

    @GetMapping("/{id}")
    public ResponseEntity<DSYAdmission> getDSYAdmissionById(@PathVariable Long id) {
        DSYAdmission admission = dsyAdmissionService.getDSYAdmissionById(id);
        return ResponseEntity.ok(admission);
    }

    @GetMapping(value = "/{id}/admission-form.pdf", produces = MediaType.APPLICATION_PDF_VALUE)
    public ResponseEntity<byte[]> downloadAdmissionFormPdf(@PathVariable Long id) {
        DSYAdmission admission = dsyAdmissionService.getDSYAdmissionById(id);
        byte[] pdf = admissionPdfService.generateDSYAdmissionForm(admission);
        String fileName = "DSY_Admission_Form_" + id + ".pdf";
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + fileName + "\"")
                .contentType(MediaType.APPLICATION_PDF)
                .body(pdf);
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

    @PutMapping(value = "/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> updateDSYAdmissionWithDocuments(
            @PathVariable Long id,
            @Valid @ModelAttribute DSYAdmissionRequestDTO request,
            @RequestPart(value = "domicileCertificate", required = false) MultipartFile domicileCertificate,
            @RequestPart(value = "sscMarkSheet", required = false) MultipartFile sscMarkSheet,
            @RequestPart(value = "hscMarkSheet", required = false) MultipartFile hscMarkSheet,
            @RequestPart(value = "casteCertificate", required = false) MultipartFile casteCertificate,
            @RequestPart(value = "nonCreamyLayerCertificate", required = false) MultipartFile nonCreamyLayerCertificate,
            @RequestPart(value = "aadhaarCard", required = false) MultipartFile aadhaarCard,
            @RequestPart(value = "studentPhoto", required = false) MultipartFile studentPhoto,
            @RequestPart(value = "undertakingForm", required = false) MultipartFile undertakingForm) {
        DSYAdmission existing = dsyAdmissionService.getDSYAdmissionById(id);
        request.setDomicileCertificatePath(existing.getDomicileCertificatePath());
        request.setSscMarkSheetPath(existing.getSscMarkSheetPath());
        request.setHscMarkSheetPath(existing.getHscMarkSheetPath());
        request.setCasteCertificatePath(existing.getCasteCertificatePath());
        request.setNonCreamyLayerCertificatePath(existing.getNonCreamyLayerCertificatePath());
        request.setAadhaarCardPath(existing.getAadhaarCardPath());
        request.setStudentPhotoPath(existing.getStudentPhotoPath());
        request.setUndertakingFormPath(existing.getUndertakingFormPath());
        try {
            if (domicileCertificate != null && !domicileCertificate.isEmpty()) request.setDomicileCertificatePath(fileStorageService.saveFile(domicileCertificate, "DSY", id.toString()));
            if (sscMarkSheet != null && !sscMarkSheet.isEmpty()) request.setSscMarkSheetPath(fileStorageService.saveFile(sscMarkSheet, "DSY", id.toString()));
            if (hscMarkSheet != null && !hscMarkSheet.isEmpty()) request.setHscMarkSheetPath(fileStorageService.saveFile(hscMarkSheet, "DSY", id.toString()));
            if (casteCertificate != null && !casteCertificate.isEmpty()) request.setCasteCertificatePath(fileStorageService.saveFile(casteCertificate, "DSY", id.toString()));
            if (nonCreamyLayerCertificate != null && !nonCreamyLayerCertificate.isEmpty()) request.setNonCreamyLayerCertificatePath(fileStorageService.saveFile(nonCreamyLayerCertificate, "DSY", id.toString()));
            if (aadhaarCard != null && !aadhaarCard.isEmpty()) request.setAadhaarCardPath(fileStorageService.saveFile(aadhaarCard, "DSY", id.toString()));
            if (studentPhoto != null && !studentPhoto.isEmpty()) request.setStudentPhotoPath(fileStorageService.saveFile(studentPhoto, "DSY", id.toString()));
            if (undertakingForm != null && !undertakingForm.isEmpty()) request.setUndertakingFormPath(fileStorageService.saveFile(undertakingForm, "DSY", id.toString()));
            return ResponseEntity.ok(dsyAdmissionService.updateDSYAdmission(id, request));
        } catch (IllegalArgumentException e) {
            logger.warn("Update DSY admission documents failed: {}", e.getMessage());
            return ResponseEntity.badRequest().body(java.util.Map.of("error", e.getMessage()));
        } catch (Exception e) {
            logger.error("Update DSY admission documents failed", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(java.util.Map.of("error", "Unable to update DSY admission documents"));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteDSYAdmission(@PathVariable Long id) {
        dsyAdmissionService.deleteDSYAdmission(id);
        return ResponseEntity.noContent().build();
    }
}
