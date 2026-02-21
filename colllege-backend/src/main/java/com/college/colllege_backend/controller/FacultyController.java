package com.college.colllege_backend.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;

import com.college.colllege_backend.dto.FacultyRequestDTO;
import com.college.colllege_backend.entity.Faculty;
import com.college.colllege_backend.service.FacultyService;

@RestController
@RequestMapping("/api/faculty")
@CrossOrigin(origins = "http://localhost:3000")
public class FacultyController {

    @Autowired
    private FacultyService facultyService;

    @GetMapping
    public ResponseEntity<List<Faculty>> getAllFaculty() {
        return ResponseEntity.ok(facultyService.getAllFaculty());
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getFaculty(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(facultyService.getFacultyById(id));
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/emp/{employeeId}")
    public ResponseEntity<?> getByEmployeeId(@PathVariable String employeeId) {
        try {
            return ResponseEntity.ok(facultyService.getFacultyByEmployeeId(employeeId));
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/department/{department}")
    public ResponseEntity<List<Faculty>> getByDepartment(@PathVariable String department) {
        return ResponseEntity.ok(facultyService.getFacultyByDepartment(department));
    }

    @PostMapping
    public ResponseEntity<?> createFaculty(@Valid @RequestBody FacultyRequestDTO request) {
        try {
            Faculty faculty = facultyService.createFaculty(request);
            return ResponseEntity.status(HttpStatus.CREATED).body(faculty);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("{\"error\": \"" + e.getMessage() + "\"}");
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateFaculty(@PathVariable Long id, @Valid @RequestBody FacultyRequestDTO request) {
        try {
            Faculty faculty = facultyService.updateFaculty(id, request);
            return ResponseEntity.ok(faculty);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("{\"error\": \"" + e.getMessage() + "\"}");
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteFaculty(@PathVariable Long id) {
        try {
            facultyService.deleteFaculty(id);
            return ResponseEntity.ok("{\"message\": \"Faculty deleted successfully\"}");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("{\"error\": \"" + e.getMessage() + "\"}");
        }
    }
}
