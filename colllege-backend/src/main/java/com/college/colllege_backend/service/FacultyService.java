package com.college.colllege_backend.service;

import com.college.colllege_backend.dto.FacultyRequestDTO;
import com.college.colllege_backend.entity.Faculty;
import java.util.List;

public interface FacultyService {
    Faculty createFaculty(FacultyRequestDTO request);
    Faculty getFacultyById(Long id);
    Faculty getFacultyByEmployeeId(String employeeId);
    List<Faculty> getAllFaculty();
    List<Faculty> getFacultyByDepartment(String department);
    Faculty updateFaculty(Long id, FacultyRequestDTO request);
    void deleteFaculty(Long id);
}
