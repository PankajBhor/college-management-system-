package com.college.colllege_backend.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.college.colllege_backend.entity.DocumentChecklist;

@Repository
public interface DocumentChecklistRepository extends JpaRepository<DocumentChecklist, Long> {

    List<DocumentChecklist> findByAdmissionTypeOrderBySequenceOrder(String admissionType);
}
