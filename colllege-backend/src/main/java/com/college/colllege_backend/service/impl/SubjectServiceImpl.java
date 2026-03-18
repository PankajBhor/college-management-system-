package com.college.colllege_backend.service.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.college.colllege_backend.entity.Course;
import com.college.colllege_backend.entity.Subject;
import com.college.colllege_backend.repository.CourseRepository;
import com.college.colllege_backend.repository.SubjectRepository;
import com.college.colllege_backend.service.SubjectService;

@Service
@Transactional
public class SubjectServiceImpl implements SubjectService {

    @Autowired
    private SubjectRepository subjectRepository;

    @Autowired
    private CourseRepository courseRepository;

    @Override
    public Subject createSubject(Subject subject) {
        return subjectRepository.save(subject);
    }

    @Override
    public Subject getSubjectById(Long id) {
        return subjectRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Subject not found"));
    }

    @Override
    public List<Subject> getAllSubjects() {
        return subjectRepository.findAll();
    }

    @Override
    public List<Subject> getSubjectsByCourseId(Long courseId) {
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new RuntimeException("Course not found"));
        return subjectRepository.findByCourse(course);
    }

    @Override
    public List<Subject> getSubjectsBySemester(Integer semester) {
        return subjectRepository.findBySemester(semester);
    }

    @Override
    public Subject updateSubject(Long id, Subject subject) {
        Subject existing = getSubjectById(id);
        existing.setCode(subject.getCode());
        existing.setName(subject.getName());
        existing.setCredits(subject.getCredits());
        existing.setSemester(subject.getSemester());
        return subjectRepository.save(existing);
    }

    @Override
    public void deleteSubject(Long id) {
        subjectRepository.deleteById(id);
    }
}
