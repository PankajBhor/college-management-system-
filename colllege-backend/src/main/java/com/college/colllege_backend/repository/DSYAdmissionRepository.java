package com.college.colllege_backend.repository;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.college.colllege_backend.entity.DSYAdmission;

@Repository
public interface DSYAdmissionRepository extends JpaRepository<DSYAdmission, Long> {

    List<DSYAdmission> findByStatus(String status);

    Page<DSYAdmission> findByStatus(String status, Pageable pageable);

    List<DSYAdmission> findByAdmissionType(String admissionType);

    Page<DSYAdmission> findByAdmissionType(String admissionType, Pageable pageable);
}
