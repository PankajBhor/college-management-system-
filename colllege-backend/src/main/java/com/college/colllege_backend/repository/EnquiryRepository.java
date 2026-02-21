package com.college.colllege_backend.repository;

import com.college.colllege_backend.entity.Enquiry;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface EnquiryRepository extends JpaRepository<Enquiry, Long> {

    List<Enquiry> findByStatus(String status);

    List<Enquiry> findByFirstNameIgnoreCase(String firstName);

    List<Enquiry> findByCategory(String category);

    List<Enquiry> findByAdmissionFor(String admissionFor);

    List<Enquiry> findByLocation(String location);

    List<Enquiry> findByEmail(String email);
}
