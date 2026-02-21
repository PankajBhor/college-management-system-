package com.college.colllege_backend.service;

import com.college.colllege_backend.entity.Fees;
import com.college.colllege_backend.enums.FeeStatus;
import java.util.List;

public interface FeesService {
    Fees createFees(Fees fees);
    Fees getFeesById(Long id);
    List<Fees> getAllFees();
    List<Fees> getFeesByStudentId(Long studentId);
    List<Fees> getFeesByStatus(FeeStatus status);
    Fees updateFees(Long id, Fees fees);
    void deleteFees(Long id);
    Double getTotalPendingFees(Long studentId);
}
