package com.college.colllege_backend.dto;

import java.time.LocalDate;

public class StudentResponseDTO {
    private Long id;
    private String name;
    private String email;
    private String role;
    private String rollNumber;
    private Integer semester;
    private Integer batch;
    private String department;
    private Long courseId;
    private String courseName;
    private LocalDate admissionDate;

    // Constructors
    public StudentResponseDTO() {}

    public StudentResponseDTO(Long id, String name, String email, String rollNumber,
                           Integer semester, Integer batch, String department) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.rollNumber = rollNumber;
        this.semester = semester;
       this.batch = batch;
        this.department = department;
        this.role = "STUDENT";
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public String getRollNumber() {
        return rollNumber;
    }

    public void setRollNumber(String rollNumber) {
        this.rollNumber = rollNumber;
    }

    public Integer getSemester() {
        return semester;
    }

    public void setSemester(Integer semester) {
        this.semester = semester;
    }

    public Integer getBatch() {
        return batch;
    }

    public void setBatch(Integer batch) {
        this.batch = batch;
    }

    public String getDepartment() {
        return department;
    }

    public void setDepartment(String department) {
        this.department = department;
    }

    public Long getCourseId() {
        return courseId;
    }

    public void setCourseId(Long courseId) {
        this.courseId = courseId;
    }

    public String getCourseName() {
        return courseName;
    }

    public void setCourseName(String courseName) {
        this.courseName = courseName;
    }

    public LocalDate getAdmissionDate() {
        return admissionDate;
    }

    public void setAdmissionDate(LocalDate admissionDate) {
        this.admissionDate = admissionDate;
    }
}
