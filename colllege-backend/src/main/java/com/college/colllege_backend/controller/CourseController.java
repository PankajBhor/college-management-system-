package com.college.colllege_backend.controller;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;

import com.college.colllege_backend.dto.CourseRequestDTO;
import com.college.colllege_backend.entity.Course;
import com.college.colllege_backend.repository.CourseRepository;

@RestController
@RequestMapping("/api/courses")
@CrossOrigin(origins = "http://localhost:3000")
public class CourseController {

    @Autowired
    private CourseRepository courseRepository;

    @GetMapping
    public ResponseEntity<List<Course>> getAllCourses() {
        return ResponseEntity.ok(courseRepository.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getCourse(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(courseRepository.findById(id).get());
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping
    public ResponseEntity<?> createCourse(@Valid @RequestBody CourseRequestDTO request) {
        try {
            Course course = new Course(request.getCode(), request.getName(), request.getDuration());
            course.setDescription(request.getDescription());
            Course saved = courseRepository.save(course);
            return ResponseEntity.status(HttpStatus.CREATED).body(saved);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("{\"error\": \"" + e.getMessage() + "\"}");
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateCourse(@PathVariable Long id, @Valid @RequestBody CourseRequestDTO request) {
        try {
            Course course = courseRepository.findById(id).get();
            course.setName(request.getName());
            course.setDuration(request.getDuration());
            course.setDescription(request.getDescription());
            Course updated = courseRepository.save(course);
            return ResponseEntity.ok(updated);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("{\"error\": \"" + e.getMessage() + "\"}");
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteCourse(@PathVariable Long id) {
        try {
            courseRepository.deleteById(id);
            return ResponseEntity.ok("{\"message\": \"Course deleted successfully\"}");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("{\"error\": \"" + e.getMessage() + "\"}");
        }
    }
}
