package com.college.colllege_backend.service.impl;

import com.college.colllege_backend.dto.FacultyRequestDTO;
import com.college.colllege_backend.entity.Faculty;
import com.college.colllege_backend.repository.FacultyRepository;
import com.college.colllege_backend.service.FacultyService;
import com.college.colllege_backend.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class FacultyServiceImpl implements FacultyService {
    @Autowired
    private FacultyRepository facultyRepository;

    @Autowired
    private AuthService authService;

    @Override
    public Faculty createFaculty(FacultyRequestDTO request) {
        Faculty faculty = new Faculty();
        faculty.setEmail(request.getEmail());
        faculty.setPassword(authService.hashPassword(request.getPassword()));
        faculty.setName(request.getName());
        faculty.setEmployeeId(request.getEmployeeId());
        faculty.setDepartment(request.getDepartment());
        faculty.setQualification(request.getQualification());
        return facultyRepository.save(faculty);
    }

    @Override
    public Faculty getFacultyById(Long id) {
        return facultyRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Faculty not found"));
    }

    @Override
    public Faculty getFacultyByEmployeeId(String employeeId) {
        return facultyRepository.findByEmployeeId(employeeId)
            .orElseThrow(() -> new RuntimeException("Faculty not found"));
    }

    @Override
    public List<Faculty> getAllFaculty() {
        return facultyRepository.findAll();
    }

    @Override
    public List<Faculty> getFacultyByDepartment(String department) {
        return facultyRepository.findByDepartment(department);
    }

    @Override
    public Faculty updateFaculty(Long id, FacultyRequestDTO request) {
        Faculty faculty = getFacultyById(id);
        faculty.setName(request.getName());
        faculty.setDepartment(request.getDepartment());
        faculty.setQualification(request.getQualification());
        return facultyRepository.save(faculty);
    }

    @Override
    public void deleteFaculty(Long id) {
        facultyRepository.deleteById(id);
    }
}
