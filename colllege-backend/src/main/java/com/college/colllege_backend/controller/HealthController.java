package com.college.colllege_backend.controller;

import java.util.HashMap;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class HealthController {

    @GetMapping("/")
    public ResponseEntity<Map<String, Object>> health() {
        Map<String, Object> response = new HashMap<>();
        response.put("status", "success");
        response.put("message", "College Management System Backend is running");
        response.put("version", "1.0.0");
        response.put("timestamp", System.currentTimeMillis());
        response.put("api_endpoints", new String[]{
            "/api/enquiries",
            "/api/enquiries/{id}",
            "/api/students",
            "/api/faculty",
            "/api/courses",
            "/api/marks",
            "/api/fees",
            "/api/subjects"
        });
        return ResponseEntity.ok(response);
    }

    @GetMapping("/health")
    public ResponseEntity<Map<String, String>> healthCheck() {
        Map<String, String> response = new HashMap<>();
        response.put("status", "UP");
        response.put("service", "college-backend");
        return ResponseEntity.ok(response);
    }
}
