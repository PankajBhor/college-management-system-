package com.college.colllege_backend.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;

import com.college.colllege_backend.dto.EnquiryRequestDTO;
import com.college.colllege_backend.dto.EnquiryResponseDTO;
import com.college.colllege_backend.service.EnquiryService;

@RestController
@RequestMapping("/api/enquiries")
@CrossOrigin(origins = "http://localhost:3000")
public class EnquiryController {

    @Autowired
    private EnquiryService enquiryService;

    @GetMapping
    public ResponseEntity<List<EnquiryResponseDTO>> getAllEnquiries() {
        return ResponseEntity.ok(enquiryService.getAllEnquiries());
    }

    @GetMapping("/{id}")
    public ResponseEntity<EnquiryResponseDTO> getEnquiry(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(enquiryService.getEnquiryById(id));
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/status/{status}")
    public ResponseEntity<List<EnquiryResponseDTO>> getByStatus(@PathVariable String status) {
        try {
            return ResponseEntity.ok(enquiryService.getEnquiriesByStatus(status.toUpperCase()));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(null);
        }
    }

    @PostMapping
    public ResponseEntity<?> createEnquiry(@Valid @RequestBody EnquiryRequestDTO request) {
        try {
            EnquiryResponseDTO response = enquiryService.createEnquiry(request);
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("{\"error\": \"" + e.getMessage() + "\"}");
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateEnquiry(@PathVariable Long id, @Valid @RequestBody EnquiryRequestDTO request) {
        try {
            EnquiryResponseDTO response = enquiryService.updateEnquiry(id, request);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("{\"error\": \"" + e.getMessage() + "\"}");
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteEnquiry(@PathVariable Long id) {
        try {
            enquiryService.deleteEnquiry(id);
            return ResponseEntity.ok("{\"message\": \"Enquiry deleted successfully\"}");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("{\"error\": \"" + e.getMessage() + "\"}");
        }
    }
}
