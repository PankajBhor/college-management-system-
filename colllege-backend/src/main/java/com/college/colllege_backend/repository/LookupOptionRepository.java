package com.college.colllege_backend.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.college.colllege_backend.entity.LookupOption;

@Repository
public interface LookupOptionRepository extends JpaRepository<LookupOption, Long> {
    List<LookupOption> findByTypeAndActiveTrueOrderByDisplayOrderAscLabelAsc(String type);

    Optional<LookupOption> findByTypeAndCode(String type, String code);

    boolean existsByTypeAndCode(String type, String code);
}
