package com.college.colllege_backend.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.college.colllege_backend.entity.EmailPreset;

@Repository
public interface EmailPresetRepository extends JpaRepository<EmailPreset, Long> {
    List<EmailPreset> findByTargetScopeOrderByUpdatedAtDesc(String targetScope);
}
