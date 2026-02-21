package com.college.colllege_backend.repository;

import com.college.colllege_backend.entity.Enquiry;
import com.college.colllege_backend.enums.EnquiryStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;
import java.util.List;

@Repository
public interface EnquiryRepository extends JpaRepository<Enquiry, Long> {
    Optional<Enquiry> findByEmail(String email);
    List<Enquiry> findByStatus(EnquiryStatus status);
    List<Enquiry> findByStudentName(String studentName);
    List<Enquiry> findByCourse(String course);
}
