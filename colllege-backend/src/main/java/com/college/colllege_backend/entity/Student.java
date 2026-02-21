package com.college.colllege_backend.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;
import java.util.List;

@Entity
@Table(name = "students")
public class Student extends User {
    @Column(unique = true, nullable = false)
    @NotBlank(message = "Roll number cannot be blank")
    private String rollNumber; // CSE001

    @NotNull(message = "Semester cannot be null")
    private Integer semester; // 1-8

    @NotNull(message = "Batch cannot be null")
    private Integer batch; // 2023, 2024

    private String department;

    @Column(name = "admission_date")
    private LocalDate admissionDate;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "course_id")
    private Course course;

    @OneToMany(mappedBy = "student", cascade = CascadeType.ALL)
    private List<Fees> fees;

    @OneToMany(mappedBy = "student", cascade = CascadeType.ALL)
    private List<Marks> marks;

    // Constructors
    public Student() {
        super();
        this.setRole("STUDENT");
    }

    public Student(String email, String password, String name, String rollNumber) {
        super();
        this.setEmail(email);
        this.setPassword(password);
        this.setName(name);
        this.setRole("STUDENT");
        this.rollNumber = rollNumber;
    }

    // Getters and Setters
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

    public LocalDate getAdmissionDate() {
        return admissionDate;
    }

    public void setAdmissionDate(LocalDate admissionDate) {
        this.admissionDate = admissionDate;
    }

    public Course getCourse() {
        return course;
    }

    public void setCourse(Course course) {
        this.course = course;
    }

    public List<Fees> getFees() {
        return fees;
    }

    public void setFees(List<Fees> fees) {
        this.fees = fees;
    }

    public List<Marks> getMarks() {
        return marks;
    }

    public void setMarks(List<Marks> marks) {
        this.marks = marks;
    }
}
