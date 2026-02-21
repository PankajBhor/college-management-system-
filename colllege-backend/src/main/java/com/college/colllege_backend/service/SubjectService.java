package com.college.colllege_backend.service;

import com.college.colllege_backend.entity.Subject;
import java.util.List;

public interface SubjectService {
    Subject createSubject(Subject subject);
    Subject getSubjectById(Long id);
    List<Subject> getAllSubjects();
    List<Subject> getSubjectsByCourseId(Long courseId);
    List<Subject> getSubjectsBySemester(Integer semester);
    Subject updateSubject(Long id, Subject subject);
    void deleteSubject(Long id);
}
