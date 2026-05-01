package com.college.colllege_backend.controller;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.college.colllege_backend.entity.LookupOption;
import com.college.colllege_backend.repository.LookupOptionRepository;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/lookups")
@CrossOrigin(origins = "http://localhost:3000")
public class LookupController {

    private final LookupOptionRepository lookupOptionRepository;

    public LookupController(LookupOptionRepository lookupOptionRepository) {
        this.lookupOptionRepository = lookupOptionRepository;
    }

    @GetMapping
    public ResponseEntity<Map<String, List<LookupOption>>> getAllLookups() {
        Map<String, List<LookupOption>> grouped = lookupOptionRepository.findAll().stream()
                .filter(option -> Boolean.TRUE.equals(option.getActive()))
                .collect(Collectors.groupingBy(LookupOption::getType));
        return ResponseEntity.ok(grouped);
    }

    @GetMapping("/{type}")
    public ResponseEntity<List<LookupOption>> getLookupOptions(@PathVariable String type) {
        return ResponseEntity.ok(lookupOptionRepository.findByTypeAndActiveTrueOrderByDisplayOrderAscLabelAsc(type));
    }

    @PostMapping
    public ResponseEntity<LookupOption> createLookupOption(@Valid @RequestBody LookupOption lookupOption) {
        LookupOption saved = lookupOptionRepository.save(lookupOption);
        return ResponseEntity.ok(saved);
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateLookupOption(@PathVariable Long id, @Valid @RequestBody LookupOption request) {
        return lookupOptionRepository.findById(id)
                .map(existing -> {
                    existing.setType(request.getType());
                    existing.setCode(request.getCode());
                    existing.setLabel(request.getLabel());
                    existing.setDisplayOrder(request.getDisplayOrder());
                    existing.setActive(request.getActive());
                    return ResponseEntity.ok(lookupOptionRepository.save(existing));
                })
                .orElseGet(() -> ResponseEntity.notFound().build());
    }
}
