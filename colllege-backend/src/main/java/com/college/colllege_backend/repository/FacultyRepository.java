package com.college.colllege_backend.repository;

import com.college.colllege_backend.entity.Faculty;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;
import java.util.List;

@Repository
public interface FacultyRepository extends JpaRepository<Faculty, Long> {
    Optional<Faculty> findByEmployeeId(String employeeId);
    Optional<Faculty> findByEmail(String email);
    List<Faculty> findByDepartment(String department);
}
