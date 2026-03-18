package com.college.colllege_backend.repository;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.college.colllege_backend.entity.Enquiry;

@Repository
public interface EnquiryRepository extends JpaRepository<Enquiry, Long> {

    List<Enquiry> findByStatus(String status);
    Page<Enquiry> findByStatus(String status, Pageable pageable);

    List<Enquiry> findByFirstNameIgnoreCase(String firstName);
    Page<Enquiry> findByFirstNameIgnoreCase(String firstName, Pageable pageable);

    List<Enquiry> findByCategory(String category);
    Page<Enquiry> findByCategory(String category, Pageable pageable);

    List<Enquiry> findByAdmissionFor(String admissionFor);
    Page<Enquiry> findByAdmissionFor(String admissionFor, Pageable pageable);

    List<Enquiry> findByLocation(String location);
    Page<Enquiry> findByLocation(String location, Pageable pageable);

    List<Enquiry> findByEmail(String email);
    Page<Enquiry> findByEmail(String email, Pageable pageable);

    Enquiry findBySscSeatNoIgnoreCase(String sscSeatNo);
}
