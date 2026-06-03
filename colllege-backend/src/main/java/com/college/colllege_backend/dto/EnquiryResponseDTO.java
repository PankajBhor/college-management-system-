package com.college.colllege_backend.dto;

import java.time.LocalDate;
import java.time.LocalDateTime;

public class EnquiryResponseDTO {

    private Long id;
    private String firstName;
    private String middleName;
    private String lastName;
    private String personalMobileNumber;
    private String guardianMobileNumber;
    private String email;
    private String meritDetails;
    private String admissionFor;
    private String location;
    private String otherLocation;
    private String category;
    private String branchesInterested;
    private String branchPriority1;
    private String branchPriority2;
    private String branchPriority3;
    private String branchPriority4;
    private String referenceFaculty;
    private String status;
    private String enquiryDate;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private boolean dteRegistrationDone;
    private String sscSeatNo;
    private boolean emailEnabled;
    private Long selectedEmailPresetId;
    private boolean provisionalAdmission;
    private LocalDate provisionalAdmissionDate;

    // Constructors
    public EnquiryResponseDTO() {
    }

    // 18-argument constructor for backward compatibility (without dteRegistrationDone)
    public EnquiryResponseDTO(Long id, String firstName, String middleName, String lastName,
            String personalMobileNumber, String guardianMobileNumber, String email,
            String meritDetails, String admissionFor, String location, String otherLocation,
            String category, String branchesInterested, String referenceFaculty,
            String status, String enquiryDate, LocalDateTime createdAt, LocalDateTime updatedAt) {
        this.id = id;
        this.firstName = firstName;
        this.middleName = middleName;
        this.lastName = lastName;
        this.personalMobileNumber = personalMobileNumber;
        this.guardianMobileNumber = guardianMobileNumber;
        this.email = email;
        this.meritDetails = meritDetails;
        this.admissionFor = admissionFor;
        this.location = location;
        this.otherLocation = otherLocation;
        this.category = category;
        this.branchesInterested = branchesInterested;
        this.referenceFaculty = referenceFaculty;
        this.status = status;
        this.enquiryDate = enquiryDate;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.dteRegistrationDone = false;
    }

    public EnquiryResponseDTO(Long id, String firstName, String middleName, String lastName,
            String personalMobileNumber, String guardianMobileNumber, String email,
            String meritDetails, String admissionFor, String location, String otherLocation,
            String category, String branchesInterested, String referenceFaculty,
            String status, String enquiryDate, LocalDateTime createdAt, LocalDateTime updatedAt,
            boolean dteRegistrationDone) {
        this.id = id;
        this.firstName = firstName;
        this.middleName = middleName;
        this.lastName = lastName;
        this.personalMobileNumber = personalMobileNumber;
        this.guardianMobileNumber = guardianMobileNumber;
        this.email = email;
        this.meritDetails = meritDetails;
        this.admissionFor = admissionFor;
        this.location = location;
        this.otherLocation = otherLocation;
        this.category = category;
        this.branchesInterested = branchesInterested;
        this.referenceFaculty = referenceFaculty;
        this.status = status;
        this.enquiryDate = enquiryDate;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.dteRegistrationDone = dteRegistrationDone;
    }

    public EnquiryResponseDTO(Long id, String firstName, String middleName, String lastName,
            String personalMobileNumber, String guardianMobileNumber, String email,
            String meritDetails, String admissionFor, String location, String otherLocation,
            String category, String branchesInterested, String referenceFaculty,
            String status, String enquiryDate, LocalDateTime createdAt, LocalDateTime updatedAt,
            boolean dteRegistrationDone, String sscSeatNo) {
        this.id = id;
        this.firstName = firstName;
        this.middleName = middleName;
        this.lastName = lastName;
        this.personalMobileNumber = personalMobileNumber;
        this.guardianMobileNumber = guardianMobileNumber;
        this.email = email;
        this.meritDetails = meritDetails;
        this.admissionFor = admissionFor;
        this.location = location;
        this.otherLocation = otherLocation;
        this.category = category;
        this.branchesInterested = branchesInterested;
        this.referenceFaculty = referenceFaculty;
        this.status = status;
        this.enquiryDate = enquiryDate;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.dteRegistrationDone = dteRegistrationDone;
        this.sscSeatNo = sscSeatNo;
    }

    public boolean isDteRegistrationDone() {
        return dteRegistrationDone;
    }

    public void setDteRegistrationDone(boolean dteRegistrationDone) {
        this.dteRegistrationDone = dteRegistrationDone;
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

    public String getBranchPriority1() { return branchPriority1; }
    public void setBranchPriority1(String branchPriority1) { this.branchPriority1 = branchPriority1; }
    public String getBranchPriority2() { return branchPriority2; }
    public void setBranchPriority2(String branchPriority2) { this.branchPriority2 = branchPriority2; }
    public String getBranchPriority3() { return branchPriority3; }
    public void setBranchPriority3(String branchPriority3) { this.branchPriority3 = branchPriority3; }
    public String getBranchPriority4() { return branchPriority4; }
    public void setBranchPriority4(String branchPriority4) { this.branchPriority4 = branchPriority4; }

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

    public String getSscSeatNo() {
        return sscSeatNo;
    }

    public void setSscSeatNo(String sscSeatNo) {
        this.sscSeatNo = sscSeatNo;
    }

    public boolean isEmailEnabled() {
        return emailEnabled;
    }

    public void setEmailEnabled(boolean emailEnabled) {
        this.emailEnabled = emailEnabled;
    }

    public Long getSelectedEmailPresetId() {
        return selectedEmailPresetId;
    }

    public void setSelectedEmailPresetId(Long selectedEmailPresetId) {
        this.selectedEmailPresetId = selectedEmailPresetId;
    }

    public boolean isProvisionalAdmission() {
        return provisionalAdmission;
    }

    public void setProvisionalAdmission(boolean provisionalAdmission) {
        this.provisionalAdmission = provisionalAdmission;
    }

    public LocalDate getProvisionalAdmissionDate() {
        return provisionalAdmissionDate;
    }

    public void setProvisionalAdmissionDate(LocalDate provisionalAdmissionDate) {
        this.provisionalAdmissionDate = provisionalAdmissionDate;
    }
}
