package com.college.colllege_backend.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import java.time.LocalDate;

public class EnquiryRequestDTO {

    @NotBlank(message = "First name cannot be blank")
    private String firstName;

    private String middleName;

    @NotBlank(message = "Last name cannot be blank")
    private String lastName;

    @NotBlank(message = "Personal mobile number cannot be blank")
    @Pattern(regexp = "^[0-9]{10}$", message = "Mobile number must be 10 digits")
    private String personalMobileNumber;

    @NotBlank(message = "Guardian mobile number cannot be blank")
    @Pattern(regexp = "^[0-9]{10}$", message = "Mobile number must be 10 digits")
    private String guardianMobileNumber;

    @NotBlank(message = "Email cannot be blank")
    @Email(message = "Email should be valid")
    private String email;

    private String meritDetails;

    @NotBlank(message = "Admission type cannot be blank")
    private String admissionFor;

    @NotBlank(message = "Location cannot be blank")
    private String location;

    private String otherLocation;

    @NotBlank(message = "Category cannot be blank")
    private String category;

    private String branchesInterested;
    private String branchPriority1;
    private String branchPriority2;
    private String branchPriority3;
    private String branchPriority4;

    private String referenceFaculty;

    private String status;

    private String enquiryDate;

    private String sscSeatNo;

    private boolean dteRegistrationDone;
    private boolean emailEnabled;
    private Long selectedEmailPresetId;
    private boolean provisionalAdmission;
    private LocalDate provisionalAdmissionDate;

    // Getters and Setters
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

    public String getSscSeatNo() {
        return sscSeatNo;
    }

    public void setSscSeatNo(String sscSeatNo) {
        this.sscSeatNo = sscSeatNo;
    }

    public boolean isDteRegistrationDone() {
        return dteRegistrationDone;
    }

    public void setDteRegistrationDone(boolean dteRegistrationDone) {
        this.dteRegistrationDone = dteRegistrationDone;
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
