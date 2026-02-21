package com.college.colllege_backend.service.impl;

import com.college.colllege_backend.dto.StudentRequestDTO;
import com.college.colllege_backend.dto.StudentResponseDTO;
import com.college.colllege_backend.entity.Course;
import com.college.colllege_backend.entity.Student;
import com.college.colllege_backend.repository.CourseRepository;
import com.college.colllege_backend.repository.StudentRepository;
import com.college.colllege_backend.service.StudentService;
import com.college.colllege_backend.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class StudentServiceImpl implements StudentService {
    @Autowired
    private StudentRepository studentRepository;

    @Autowired
    private CourseRepository courseRepository;

    @Autowired
    private AuthService authService;

    @Override
    public StudentResponseDTO createStudent(StudentRequestDTO request) {
        Student student = new Student();
        student.setEmail(request.getEmail());
        student.setPassword(authService.hashPassword(request.getPassword()));
        student.setName(request.getName());
        student.setRollNumber(request.getRollNumber());
        student.setSemester(request.getSemester());
        student.setBatch(request.getBatch());
        student.setDepartment(request.getDepartment());
        student.setAdmissionDate(request.getAdmissionDate());

        if (request.getCourseId() != null) {
            Optional<Course> course = courseRepository.findById(request.getCourseId());
            course.ifPresent(student::setCourse);
        }

        Student saved = studentRepository.save(student);
        return mapToDTO(saved);
    }

    @Override
    public StudentResponseDTO getStudentById(Long id) {
        return studentRepository.findById(id)
            .map(this::mapToDTO)
            .orElseThrow(() -> new RuntimeException("Student not found"));
    }

    @Override
    public StudentResponseDTO getStudentByRollNumber(String rollNumber) {
        return studentRepository.findByRollNumber(rollNumber)
            .map(this::mapToDTO)
            .orElseThrow(() -> new RuntimeException("Student not found"));
    }

    @Override
    public List<StudentResponseDTO> getAllStudents() {
        return studentRepository.findAll().stream()
            .map(this::mapToDTO)
            .collect(Collectors.toList());
    }

    @Override
    public StudentResponseDTO updateStudent(Long id, StudentRequestDTO request) {
        Student student = studentRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Student not found"));

        student.setName(request.getName());
        student.setSemester(request.getSemester());
        student.setBatch(request.getBatch());
        student.setDepartment(request.getDepartment());

        if (request.getCourseId() != null) {
            Optional<Course> course = courseRepository.findById(request.getCourseId());
            course.ifPresent(student::setCourse);
        }

        Student updated = studentRepository.save(student);
        return mapToDTO(updated);
    }

    @Override
    public void deleteStudent(Long id) {
        studentRepository.deleteById(id);
    }

    private StudentResponseDTO mapToDTO(Student student) {
        StudentResponseDTO dto = new StudentResponseDTO();
        dto.setId(student.getId());
        dto.setName(student.getName());
        dto.setEmail(student.getEmail());
        dto.setRole(student.getRole());
        dto.setRollNumber(student.getRollNumber());
        dto.setSemester(student.getSemester());
        dto.setBatch(student.getBatch());
        dto.setDepartment(student.getDepartment());
        dto.setAdmissionDate(student.getAdmissionDate());
        if (student.getCourse() != null) {
            dto.setCourseId(student.getCourse().getId());
            dto.setCourseName(student.getCourse().getName());
        }
        return dto;
    }
}
