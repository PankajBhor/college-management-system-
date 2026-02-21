package com.college.colllege_backend.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.college.colllege_backend.entity.Fees;
import com.college.colllege_backend.enums.FeeStatus;
import com.college.colllege_backend.service.FeesService;

@RestController
@RequestMapping("/api/fees")
@CrossOrigin(origins = "http://localhost:3000")
public class FeesController {

    @Autowired
    private FeesService feesService;

    @GetMapping
    public ResponseEntity<List<Fees>> getAllFees() {
        return ResponseEntity.ok(feesService.getAllFees());
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getFees(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(feesService.getFeesById(id));
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/student/{studentId}")
    public ResponseEntity<List<Fees>> getByStudent(@PathVariable Long studentId) {
        return ResponseEntity.ok(feesService.getFeesByStudentId(studentId));
    }

    @GetMapping("/status/{status}")
    public ResponseEntity<List<Fees>> getByStatus(@PathVariable String status) {
        try {
            return ResponseEntity.ok(feesService.getFeesByStatus(FeeStatus.valueOf(status.toUpperCase())));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(null);
        }
    }

    @GetMapping("/student/{studentId}/pending-total")
    public ResponseEntity<Double> getPendingTotal(@PathVariable Long studentId) {
        return ResponseEntity.ok(feesService.getTotalPendingFees(studentId));
    }

    @PostMapping
    public ResponseEntity<?> createFees(@RequestBody Fees fees) {
        try {
            Fees created = feesService.createFees(fees);
            return ResponseEntity.status(HttpStatus.CREATED).body(created);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("{\"error\": \"" + e.getMessage() + "\"}");
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateFees(@PathVariable Long id, @RequestBody Fees fees) {
        try {
            Fees updated = feesService.updateFees(id, fees);
            return ResponseEntity.ok(updated);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("{\"error\": \"" + e.getMessage() + "\"}");
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteFees(@PathVariable Long id) {
        try {
            feesService.deleteFees(id);
            return ResponseEntity.ok("{\"message\": \"Fees deleted successfully\"}");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("{\"error\": \"" + e.getMessage() + "\"}");
        }
    }
}
