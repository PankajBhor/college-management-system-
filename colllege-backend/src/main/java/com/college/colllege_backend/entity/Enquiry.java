package com.college.colllege_backend.entity;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;

@Entity
@Table(name = "enquiries")
public class Enquiry {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "First name cannot be blank")
    private String firstName;

    private String middleName;

    @Column(name = "dte_registration_done", nullable = false)
    private boolean dteRegistrationDone = false;

    public boolean isDteRegistrationDone() {
        return dteRegistrationDone;
    }

    public void setDteRegistrationDone(boolean dteRegistrationDone) {
        this.dteRegistrationDone = dteRegistrationDone;
    }
    @NotBlank(message = "Last name cannot be blank")
    private String lastName;

    @Column(nullable = false)
    @NotBlank(message = "Personal mobile number cannot be blank")
    @Pattern(regexp = "^[0-9]{10}$", message = "Mobile number must be 10 digits")
    private String personalMobileNumber;

    @Column(nullable = false)
    @NotBlank(message = "Guardian mobile number cannot be blank")
    @Pattern(regexp = "^[0-9]{10}$", message = "Mobile number must be 10 digits")
    private String guardianMobileNumber;

    @Column(nullable = false)
    @Email(message = "Email should be valid")
    private String email;

    @Column(columnDefinition = "VARCHAR(1000)")
    private String meritDetails; // Store as JSON string for flexibility

    @Column(nullable = false)
    private String admissionFor; // FY or DSY

    @Column(nullable = false)
    private String location;

    private String otherLocation;

    @Column(nullable = false)
    private String category;

    @Column(columnDefinition = "LONGTEXT")
    private String branchesInterested; // Store as JSON string

    private String referenceFaculty;

    @Column(name = "status", nullable = false)
    private String status;

    @Column(name = "enquiry_date", nullable = false)
    private String enquiryDate;

    @Column(name = "created_at", nullable = false, updatable = false, columnDefinition = "TIMESTAMP DEFAULT CURRENT_TIMESTAMP")
    private LocalDateTime createdAt;

    @Column(name = "updated_at", columnDefinition = "TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP")
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
        if (status == null) {
            status = "Pending";
        }
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    // Constructors
    public Enquiry() {
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getFirstName() {
        return firstName;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public String getMiddleName() {
        return middleName;
    }

    public void setMiddleName(String middleName) {
        this.middleName = middleName;
    }

    @Column(name = "dte_registration_done", nullable = false)
    public String getLastName() {
        return lastName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public String getPersonalMobileNumber() {
        return personalMobileNumber;
    }

    public void setPersonalMobileNumber(String personalMobileNumber) {
        this.personalMobileNumber = personalMobileNumber;
    }

    public String getGuardianMobileNumber() {
        return guardianMobileNumber;
    }

    public void setGuardianMobileNumber(String guardianMobileNumber) {
        this.guardianMobileNumber = guardianMobileNumber;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getMeritDetails() {
        return meritDetails;
    }

    public void setMeritDetails(String meritDetails) {
        this.meritDetails = meritDetails;
    }

    public String getAdmissionFor() {
        return admissionFor;
    }

    public void setAdmissionFor(String admissionFor) {
        this.admissionFor = admissionFor;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public String getOtherLocation() {
        return otherLocation;
    }

    public void setOtherLocation(String otherLocation) {
        this.otherLocation = otherLocation;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public String getBranchesInterested() {
        return branchesInterested;
    }

    public void setBranchesInterested(String branchesInterested) {
        this.branchesInterested = branchesInterested;
    }

    public String getReferenceFaculty() {
        return referenceFaculty;
    }

    public void setReferenceFaculty(String referenceFaculty) {
        this.referenceFaculty = referenceFaculty;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getEnquiryDate() {
        return enquiryDate;
    }

    public void setEnquiryDate(String enquiryDate) {
        this.enquiryDate = enquiryDate;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
}
