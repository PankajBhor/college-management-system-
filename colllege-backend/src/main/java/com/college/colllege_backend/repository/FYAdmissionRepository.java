package com.college.colllege_backend.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.college.colllege_backend.entity.FYAdmission;

@Repository
public interface FYAdmissionRepository extends JpaRepository<FYAdmission, Long> {

    List<FYAdmission> findByStatus(String status);

    List<FYAdmission> findByAdmissionType(String admissionType);
}
