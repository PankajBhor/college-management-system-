package com.college.colllege_backend.service;

import com.college.colllege_backend.entity.Marks;
import java.util.List;

public interface MarksService {
    Marks createMarks(Marks marks);
    Marks getMarksById(Long id);
    List<Marks> getAllMarks();
    List<Marks> getMarksByStudentId(Long studentId);
    List<Marks> getMarksBySubjectId(Long subjectId);
    Marks updateMarks(Long id, Marks marks);
    void deleteMarks(Long id);
}
