package com.college.colllege_backend.repository;

import com.college.colllege_backend.entity.Course;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface CourseRepository extends JpaRepository<Course, Long> {
    Optional<Course> findByCode(String code);
    Optional<Course> findByName(String name);
}
