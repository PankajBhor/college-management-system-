package com.college.colllege_backend.service.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.college.colllege_backend.entity.Marks;
import com.college.colllege_backend.entity.Student;
import com.college.colllege_backend.entity.Subject;
import com.college.colllege_backend.repository.MarksRepository;
import com.college.colllege_backend.repository.StudentRepository;
import com.college.colllege_backend.repository.SubjectRepository;
import com.college.colllege_backend.service.MarksService;

@Service
@Transactional
public class MarksServiceImpl implements MarksService {

    @Autowired
    private MarksRepository marksRepository;

    @Autowired
    private StudentRepository studentRepository;

    @Autowired
    private SubjectRepository subjectRepository;

    @Override
    public Marks createMarks(Marks marks) {
        return marksRepository.save(marks);
    }

    @Override
    public Marks getMarksById(Long id) {
        return marksRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Marks not found"));
    }

    @Override
    public List<Marks> getAllMarks() {
        return marksRepository.findAll();
    }

    @Override
    public List<Marks> getMarksByStudentId(Long studentId) {
        Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new RuntimeException("Student not found"));
        return marksRepository.findByStudent(student);
    }

    @Override
    public List<Marks> getMarksBySubjectId(Long subjectId) {
        Subject subject = subjectRepository.findById(subjectId)
                .orElseThrow(() -> new RuntimeException("Subject not found"));
        return marksRepository.findBySubject(subject);
    }

    @Override
    public Marks updateMarks(Long id, Marks marks) {
        Marks existing = getMarksById(id);
        existing.setMarksObtained(marks.getMarksObtained());
        existing.setGrade(marks.getGrade());
        existing.setAcademicYear(marks.getAcademicYear());
        return marksRepository.save(existing);
    }

    @Override
    public void deleteMarks(Long id) {
        marksRepository.deleteById(id);
    }
}
