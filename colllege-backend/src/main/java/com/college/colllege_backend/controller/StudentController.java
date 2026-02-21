package com.college.colllege_backend.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;

import com.college.colllege_backend.dto.StudentRequestDTO;
import com.college.colllege_backend.dto.StudentResponseDTO;
import com.college.colllege_backend.service.StudentService;

@RestController
@RequestMapping("/api/students")
@CrossOrigin(origins = "http://localhost:3000")
public class StudentController {

    @Autowired
    private StudentService studentService;

    @GetMapping
    public ResponseEntity<List<StudentResponseDTO>> getAllStudents() {
        return ResponseEntity.ok(studentService.getAllStudents());
    }

    @GetMapping("/{id}")
    public ResponseEntity<StudentResponseDTO> getStudent(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(studentService.getStudentById(id));
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/roll/{rollNumber}")
    public ResponseEntity<StudentResponseDTO> getByRollNumber(@PathVariable String rollNumber) {
        try {
            return ResponseEntity.ok(studentService.getStudentByRollNumber(rollNumber));
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping
    public ResponseEntity<?> createStudent(@Valid @RequestBody StudentRequestDTO request) {
        try {
            StudentResponseDTO response = studentService.createStudent(request);
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("{\"error\": \"" + e.getMessage() + "\"}");
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateStudent(@PathVariable Long id, @Valid @RequestBody StudentRequestDTO request) {
        try {
            StudentResponseDTO response = studentService.updateStudent(id, request);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("{\"error\": \"" + e.getMessage() + "\"}");
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteStudent(@PathVariable Long id) {
        try {
            studentService.deleteStudent(id);
            return ResponseEntity.ok("{\"message\": \"Student deleted successfully\"}");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("{\"error\": \"" + e.getMessage() + "\"}");
        }
    }
}
