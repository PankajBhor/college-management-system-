package com.college.colllege_backend.service;

import java.util.List;

import com.college.colllege_backend.dto.StudentRequestDTO;
import com.college.colllege_backend.dto.StudentResponseDTO;

public interface StudentService {

    StudentResponseDTO createStudent(StudentRequestDTO request);

    StudentResponseDTO getStudentById(Long id);

    StudentResponseDTO getStudentByRollNumber(String rollNumber);

    List<StudentResponseDTO> getAllStudents();

    StudentResponseDTO updateStudent(Long id, StudentRequestDTO request);

    void deleteStudent(Long id);
}
