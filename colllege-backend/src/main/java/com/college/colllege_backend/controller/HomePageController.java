package com.college.colllege_backend.controller;

import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.college.colllege_backend.service.HomePageService;

@RestController
@RequestMapping("/api/home-page")
@CrossOrigin(origins = "http://localhost:3000")
public class HomePageController {

    private final HomePageService homePageService;

    public HomePageController(HomePageService homePageService) {
        this.homePageService = homePageService;
    }

    @GetMapping
    public ResponseEntity<Map<String, Object>> getHomePage() {
        return ResponseEntity.ok(homePageService.getHomePage());
    }

    @GetMapping("/admin")
    public ResponseEntity<?> getEditableContent() {
        return ResponseEntity.ok(homePageService.getEditableContent());
    }

    @PutMapping
    public ResponseEntity<Map<String, Object>> updateHomePage(@RequestBody Map<String, Object> request) {
        return ResponseEntity.ok(homePageService.updateHomePage(request));
    }
}
