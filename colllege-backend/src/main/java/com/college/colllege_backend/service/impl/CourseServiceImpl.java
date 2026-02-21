package com.college.colllege_backend.service.impl;

import com.college.colllege_backend.dto.CourseRequestDTO;
import com.college.colllege_backend.entity.Course;
import com.college.colllege_backend.repository.CourseRepository;
import com.college.colllege_backend.service.CourseService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CourseServiceImpl implements CourseService {
    @Autowired
    private CourseRepository courseRepository;

    @Override
    public Course createCourse(CourseRequestDTO request) {
        Course course = new Course(request.getCode(), request.getName(), request.getDuration());
        course.setDescription(request.getDescription());
        return courseRepository.save(course);
    }

    @Override
    public Course getCourseById(Long id) {
        return courseRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Course not found"));
    }

    @Override
    public Course getCourseByCode(String code) {
        return courseRepository.findByCode(code)
            .orElseThrow(() -> new RuntimeException("Course not found"));
    }

    @Override
    public List<Course> getAllCourses() {
        return courseRepository.findAll();
    }

    @Override
    public Course updateCourse(Long id, CourseRequestDTO request) {
        Course course = getCourseById(id);
        course.setName(request.getName());
        course.setDuration(request.getDuration());
        course.setDescription(request.getDescription());
        return courseRepository.save(course);
    }

    @Override
    public void deleteCourse(Long id) {
        courseRepository.deleteById(id);
    }
}
