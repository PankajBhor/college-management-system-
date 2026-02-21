package com.college.colllege_backend.repository;

import com.college.colllege_backend.entity.Fees;
import com.college.colllege_backend.entity.Student;
import com.college.colllege_backend.enums.FeeStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface FeesRepository extends JpaRepository<Fees, Long> {
    List<Fees> findByStudent(Student student);
    List<Fees> findByStatus(FeeStatus status);
}
