package com.college.colllege_backend.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.college.colllege_backend.dto.DocumentChecklistDTO;
import com.college.colllege_backend.service.DocumentChecklistServiceInterface;

@RestController
@RequestMapping("/api/documents")
@CrossOrigin(origins = "http://localhost:3000")
public class DocumentChecklistController {

    @Autowired
    private DocumentChecklistServiceInterface documentChecklistService;

    @GetMapping("/{admissionType}")
    public ResponseEntity<List<DocumentChecklistDTO>> getDocumentsByAdmissionType(
            @PathVariable String admissionType) {
        List<DocumentChecklistDTO> documents = documentChecklistService.getDocumentsByAdmissionType(admissionType);
        return ResponseEntity.ok(documents);
    }

    @PostMapping("/initialize")
    public ResponseEntity<String> initializeDocuments() {
        documentChecklistService.initializeDefaultDocuments();
        return ResponseEntity.ok("Documents initialized successfully");
    }
}
