package com.college.colllege_backend.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.util.List;

@Entity
@Table(name = "subjects")
public class Subject {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Subject code cannot be blank")
    private String code; // CS101

    @NotBlank(message = "Subject name cannot be blank")
    private String name;

    @NotNull(message = "Credits cannot be null")
    private Integer credits;

    @NotNull(message = "Semester cannot be null")
    private Integer semester;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "course_id")
    private Course course;

    @OneToMany(mappedBy = "subject", cascade = CascadeType.ALL)
    private List<Marks> marks;

    @ManyToMany(mappedBy = "subjects")
    private List<Faculty> faculty;

    // Constructors
    public Subject() {}

    public Subject(String code, String name, Integer credits, Integer semester) {
        this.code = code;
        this.name = name;
        this.credits = credits;
        this.semester = semester;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Integer getCredits() {
        return credits;
    }

    public void setCredits(Integer credits) {
        this.credits = credits;
    }

    public Integer getSemester() {
        return semester;
    }

    public void setSemester(Integer semester) {
        this.semester = semester;
    }

    public Course getCourse() {
        return course;
    }

    public void setCourse(Course course) {
        this.course = course;
    }

    public List<Marks> getMarks() {
        return marks;
    }

    public void setMarks(List<Marks> marks) {
        this.marks = marks;
    }

    public List<Faculty> getFaculty() {
        return faculty;
    }

    public void setFaculty(List<Faculty> faculty) {
        this.faculty = faculty;
    }
}
