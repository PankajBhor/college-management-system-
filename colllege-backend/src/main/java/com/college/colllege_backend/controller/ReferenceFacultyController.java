package com.college.colllege_backend.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
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

    @GetMapping("/all")
    public ResponseEntity<List<ReferenceFaculty>> getAllReferenceFaculty() {
        return ResponseEntity.ok(referenceFacultyRepository.findAll());
    }

    @PostMapping
    public ResponseEntity<ReferenceFaculty> createReferenceFaculty(@RequestBody ReferenceFaculty faculty) {
        faculty.setId(null);
        normalize(faculty);
        if (faculty.getActive() == null) {
            faculty.setActive(true);
        }
        return ResponseEntity.status(HttpStatus.CREATED).body(referenceFacultyRepository.save(faculty));
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateReferenceFaculty(@PathVariable Long id, @RequestBody ReferenceFaculty request) {
        return referenceFacultyRepository.findById(id)
                .map(faculty -> {
                    faculty.setName(request.getName());
                    faculty.setDepartment(request.getDepartment());
                    faculty.setEmail(request.getEmail());
                    normalize(faculty);
                    faculty.setActive(request.getActive() == null ? Boolean.TRUE : request.getActive());
                    return ResponseEntity.ok(referenceFacultyRepository.save(faculty));
                })
                .orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND).build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteReferenceFaculty(@PathVariable Long id) {
        if (!referenceFacultyRepository.existsById(id)) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
        referenceFacultyRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    private void normalize(ReferenceFaculty faculty) {
        if (faculty.getName() != null) {
            faculty.setName(faculty.getName().trim());
        }
        if (faculty.getEmail() != null && faculty.getEmail().trim().isEmpty()) {
            faculty.setEmail(null);
        }
        if (faculty.getDepartment() != null && faculty.getDepartment().trim().isEmpty()) {
            faculty.setDepartment(null);
        }
    }
}
