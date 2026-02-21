package com.college.colllege_backend.repository;

import com.college.colllege_backend.entity.Subject;
import com.college.colllege_backend.entity.Course;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface SubjectRepository extends JpaRepository<Subject, Long> {
    List<Subject> findByCourse(Course course);
    List<Subject> findBySemester(Integer semester);
}
