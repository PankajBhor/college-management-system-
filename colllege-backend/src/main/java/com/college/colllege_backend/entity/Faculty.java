package com.college.colllege_backend.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import java.util.List;

@Entity
@Table(name = "faculty")
public class Faculty extends User {
    @Column(unique = true, nullable = false)
    @NotBlank(message = "Employee ID cannot be blank")
    private String employeeId;

    @NotBlank(message = "Department cannot be blank")
    private String department;

    private String qualification;

    @ManyToMany
    @JoinTable(
        name = "faculty_subjects",
        joinColumns = @JoinColumn(name = "faculty_id"),
        inverseJoinColumns = @JoinColumn(name = "subject_id")
    )
    private List<Subject> subjects;

    // Constructors
    public Faculty() {
        super();
        this.setRole("FACULTY");
    }

    public Faculty(String email, String password, String name, String employeeId, String department) {
        super();
        this.setEmail(email);
        this.setPassword(password);
        this.setName(name);
        this.setRole("FACULTY");
        this.employeeId = employeeId;
        this.department = department;
    }

    // Getters and Setters
    public String getEmployeeId() {
        return employeeId;
    }

    public void setEmployeeId(String employeeId) {
        this.employeeId = employeeId;
    }

    public String getDepartment() {
        return department;
    }

    public void setDepartment(String department) {
        this.department = department;
    }

    public String getQualification() {
        return qualification;
    }

    public void setQualification(String qualification) {
        this.qualification = qualification;
    }

    public List<Subject> getSubjects() {
        return subjects;
    }

    public void setSubjects(List<Subject> subjects) {
        this.subjects = subjects;
    }
}
