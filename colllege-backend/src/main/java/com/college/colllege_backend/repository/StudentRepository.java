package com.college.colllege_backend.repository;

import com.college.colllege_backend.entity.Student;
import com.college.colllege_backend.entity.Course;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;
import java.util.List;

@Repository
public interface StudentRepository extends JpaRepository<Student, Long> {
    Optional<Student> findByRollNumber(String rollNumber);
    Optional<Student> findByEmail(String email);
    List<Student> findByCourse(Course course);
    List<Student> findBySemester(Integer semester);
    List<Student> findByDepartment(String department);
    List<Student> findByBatch(Integer batch);
}
