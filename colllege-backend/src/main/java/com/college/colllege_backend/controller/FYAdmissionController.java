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

import com.college.colllege_backend.dto.FYAdmissionRequestDTO;
import com.college.colllege_backend.entity.FYAdmission;
import com.college.colllege_backend.service.FYAdmissionService;
import com.college.colllege_backend.service.FileStorageService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/admissions/fy")
@CrossOrigin(origins = "http://localhost:3000")
public class FYAdmissionController {

    @Autowired
    private FYAdmissionService fyAdmissionService;

    @Autowired
    private FileStorageService fileStorageService;

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
    public ResponseEntity<List<FYAdmission>> getAllFYAdmissions() {
        List<FYAdmission> admissions = fyAdmissionService.getAllFYAdmissions();
        return ResponseEntity.ok(admissions);
    }

    @GetMapping("/status/{status}")
    public ResponseEntity<List<FYAdmission>> getFYAdmissionsByStatus(@PathVariable String status) {
        List<FYAdmission> admissions = fyAdmissionService.getFYAdmissionsByStatus(status);
        return ResponseEntity.ok(admissions);
    }

    @GetMapping("/admission-type/{admissionType}")
    public ResponseEntity<List<FYAdmission>> getFYAdmissionsByAdmissionType(@PathVariable String admissionType) {
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
