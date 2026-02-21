package com.college.colllege_backend.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;

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

    private String referenceFaculty;

    private String status;

    private String enquiryDate;

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
}
