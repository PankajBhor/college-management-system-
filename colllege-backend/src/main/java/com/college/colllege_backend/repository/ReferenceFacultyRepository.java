package com.college.colllege_backend.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.college.colllege_backend.entity.ReferenceFaculty;

public interface ReferenceFacultyRepository extends JpaRepository<ReferenceFaculty, Long> {
    List<ReferenceFaculty> findByActiveTrueOrderByNameAsc();
    Optional<ReferenceFaculty> findByEmail(String email);
}
