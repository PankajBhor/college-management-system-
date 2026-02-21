package com.college.colllege_backend.service;

import com.college.colllege_backend.dto.CourseRequestDTO;
import com.college.colllege_backend.entity.Course;
import java.util.List;

public interface CourseService {
    Course createCourse(CourseRequestDTO request);
    Course getCourseById(Long id);
    Course getCourseByCode(String code);
    List<Course> getAllCourses();
    Course updateCourse(Long id, CourseRequestDTO request);
    void deleteCourse(Long id);
}
