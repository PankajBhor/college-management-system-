package com.college.colllege_backend.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.college.colllege_backend.entity.ReferenceFaculty;
import com.college.colllege_backend.repository.ReferenceFacultyRepository;

@RestController
@RequestMapping("/api/reference-faculty")
@CrossOrigin(origins = "http://localhost:3000")
public class ReferenceFacultyController {
    @Autowired
    private ReferenceFacultyRepository referenceFacultyRepository;

    @GetMapping
    public ResponseEntity<List<ReferenceFaculty>> getActiveReferenceFaculty() {
        return ResponseEntity.ok(referenceFacultyRepository.findByActiveTrueOrderByNameAsc());
    }
}
