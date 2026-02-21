package com.college.colllege_backend.repository;

import com.college.colllege_backend.entity.Marks;
import com.college.colllege_backend.entity.Student;
import com.college.colllege_backend.entity.Subject;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface MarksRepository extends JpaRepository<Marks, Long> {
    List<Marks> findByStudent(Student student);
    List<Marks> findBySubject(Subject subject);
    Optional<Marks> findByStudentAndSubject(Student student, Subject subject);
}
