package com.college.colllege_backend.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
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
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.college.colllege_backend.dto.DSYAdmissionRequestDTO;
import com.college.colllege_backend.entity.DSYAdmission;
import com.college.colllege_backend.service.DSYAdmissionService;
import com.college.colllege_backend.service.FileStorageService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/admissions/dsy")
@CrossOrigin(origins = "http://localhost:3000")
public class DSYAdmissionController {

    @Autowired
    private DSYAdmissionService dsyAdmissionService;

    @Autowired
    private FileStorageService fileStorageService;

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
    public ResponseEntity<List<DSYAdmission>> getAllDSYAdmissions() {
        List<DSYAdmission> admissions = dsyAdmissionService.getAllDSYAdmissions();
        return ResponseEntity.ok(admissions);
    }

    @GetMapping("/status/{status}")
    public ResponseEntity<List<DSYAdmission>> getDSYAdmissionsByStatus(@PathVariable String status) {
        List<DSYAdmission> admissions = dsyAdmissionService.getDSYAdmissionsByStatus(status);
        return ResponseEntity.ok(admissions);
    }

    @GetMapping("/admission-type/{admissionType}")
    public ResponseEntity<List<DSYAdmission>> getDSYAdmissionsByAdmissionType(@PathVariable String admissionType) {
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
