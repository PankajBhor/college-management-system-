package com.college.colllege_backend.service.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.college.colllege_backend.entity.Fees;
import com.college.colllege_backend.entity.Student;
import com.college.colllege_backend.enums.FeeStatus;
import com.college.colllege_backend.repository.FeesRepository;
import com.college.colllege_backend.repository.StudentRepository;
import com.college.colllege_backend.service.FeesService;

@Service
@Transactional
public class FeesServiceImpl implements FeesService {

    @Autowired
    private FeesRepository feesRepository;

    @Autowired
    private StudentRepository studentRepository;

    @Override
    public Fees createFees(Fees fees) {
        return feesRepository.save(fees);
    }

    @Override
    public Fees getFeesById(Long id) {
        return feesRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Fees not found"));
    }

    @Override
    public List<Fees> getAllFees() {
        return feesRepository.findAll();
    }

    @Override
    public List<Fees> getFeesByStudentId(Long studentId) {
        Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new RuntimeException("Student not found"));
        return feesRepository.findByStudent(student);
    }

    @Override
    public List<Fees> getFeesByStatus(FeeStatus status) {
        return feesRepository.findByStatus(status);
    }

    @Override
    public Fees updateFees(Long id, Fees fees) {
        Fees existing = getFeesById(id);
        existing.setAmount(fees.getAmount());
        existing.setStatus(fees.getStatus());
        existing.setDueDate(fees.getDueDate());
        existing.setPaidDate(fees.getPaidDate());
        existing.setRemarks(fees.getRemarks());
        return feesRepository.save(existing);
    }

    @Override
    public void deleteFees(Long id) {
        feesRepository.deleteById(id);
    }

    @Override
    public Double getTotalPendingFees(Long studentId) {
        Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new RuntimeException("Student not found"));
        List<Fees> pendingFees = feesRepository.findByStatus(FeeStatus.PENDING);
        return pendingFees.stream()
                .filter(f -> f.getStudent().getId().equals(studentId))
                .mapToDouble(Fees::getAmount)
                .sum();
    }
}
