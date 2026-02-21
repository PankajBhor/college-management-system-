package com.college.colllege_backend.dto;

import java.time.LocalDate;

public class EnquiryResponseDTO {
    private Long id;
    private String studentName;
    private String email;
    private String phone;
    private String course;
    private LocalDate enquiryDate;
    private String status;
    private String notes;
    private String createdBy;

    // Constructor
    public EnquiryResponseDTO() {}

    public EnquiryResponseDTO(Long id, String studentName, String email, String phone,
                            String course, LocalDate enquiryDate, String status, String notes, String createdBy) {
        this.id = id;
        this.studentName = studentName;
        this.email = email;
        this.phone = phone;
        this.course = course;
        this.enquiryDate = enquiryDate;
        this.status = status;
        this.notes = notes;
        this.createdBy = createdBy;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getStudentName() {
        return studentName;
    }

    public void setStudentName(String studentName) {
        this.studentName = studentName;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getCourse() {
        return course;
    }

    public void setCourse(String course) {
        this.course = course;
    }

    public LocalDate getEnquiryDate() {
        return enquiryDate;
    }

    public void setEnquiryDate(LocalDate enquiryDate) {
        this.enquiryDate = enquiryDate;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getNotes() {
        return notes;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }

    public String getCreatedBy() {
        return createdBy;
    }

    public void setCreatedBy(String createdBy) {
        this.createdBy = createdBy;
    }
}
