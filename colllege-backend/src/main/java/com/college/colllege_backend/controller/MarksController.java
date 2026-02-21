package com.college.colllege_backend.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.college.colllege_backend.entity.Marks;
import com.college.colllege_backend.service.MarksService;

@RestController
@RequestMapping("/api/marks")
@CrossOrigin(origins = "http://localhost:3000")
public class MarksController {

    @Autowired
    private MarksService marksService;

    @GetMapping
    public ResponseEntity<List<Marks>> getAllMarks() {
        return ResponseEntity.ok(marksService.getAllMarks());
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getMarks(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(marksService.getMarksById(id));
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/student/{studentId}")
    public ResponseEntity<List<Marks>> getByStudent(@PathVariable Long studentId) {
        return ResponseEntity.ok(marksService.getMarksByStudentId(studentId));
    }

    @GetMapping("/subject/{subjectId}")
    public ResponseEntity<List<Marks>> getBySubject(@PathVariable Long subjectId) {
        return ResponseEntity.ok(marksService.getMarksBySubjectId(subjectId));
    }

    @PostMapping
    public ResponseEntity<?> createMarks(@RequestBody Marks marks) {
        try {
            Marks created = marksService.createMarks(marks);
            return ResponseEntity.status(HttpStatus.CREATED).body(created);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("{\"error\": \"" + e.getMessage() + "\"}");
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateMarks(@PathVariable Long id, @RequestBody Marks marks) {
        try {
            Marks updated = marksService.updateMarks(id, marks);
            return ResponseEntity.ok(updated);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("{\"error\": \"" + e.getMessage() + "\"}");
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteMarks(@PathVariable Long id) {
        try {
            marksService.deleteMarks(id);
            return ResponseEntity.ok("{\"message\": \"Marks deleted successfully\"}");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("{\"error\": \"" + e.getMessage() + "\"}");
        }
    }
}
