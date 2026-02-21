package com.college.colllege_backend.dto;

import java.time.LocalDate;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;

public class DSYAdmissionRequestDTO {

    @NotBlank(message = "Applicant first name cannot be blank")
    private String applicantFirstName;

    private String applicantMiddleName;

    @NotBlank(message = "Applicant last name cannot be blank")
    private String applicantLastName;

    private String fatherFirstName;
    private String fatherMiddleName;
    private String fatherLastName;

    private String motherFirstName;
    private String motherMiddleName;
    private String motherLastName;

    @NotBlank(message = "Local Address cannot be blank")
    private String localAddress;

    private String localTal;
    private String localDist;
    private String localPinCode;

    @NotBlank(message = "Permanent Address cannot be blank")
    private String permanentAddress;

    private String permanentTal;
    private String permanentDist;
    private String permanentPinCode;

    @Pattern(regexp = "^[0-9]{10}$", message = "Mobile number must be 10 digits")
    private String mobileNo;

    @Email(message = "Email should be valid")
    private String studentEmail;

    @NotNull(message = "Gender cannot be null")
    private String gender;

    @NotNull(message = "Date of birth cannot be null")
    private LocalDate dateOfBirth;

    private String bloodGroup;

    private String aadhaarNo;

    private String educationalQualification;

    private String instituteName;
    private String previousProgramCode;
    private Double previousCGPA;
    private Double scienceMarks;

    @NotNull(message = "Program cannot be null")
    private String program;

    private String category;
    private String caste;
    private String annualIncome;

    private String physicallyHandicapped;

    @NotNull(message = "Admission type cannot be null")
    private String admissionType;

    private Integer preference1;
    private Integer preference2;
    private Integer preference3;
    private Integer preference4;

    // Document File Paths
    private String domicileCertificatePath;
    private String sscMarkSheetPath;
    private String hscMarkSheetPath;
    private String casteCertificatePath;
    private String nonCreamyLayerCertificatePath;
    private String aadhaarCardPath;

    // Getters and Setters
    public String getApplicantFirstName() {
        return applicantFirstName;
    }

    public void setApplicantFirstName(String applicantFirstName) {
        this.applicantFirstName = applicantFirstName;
    }

    public String getApplicantMiddleName() {
        return applicantMiddleName;
    }

    public void setApplicantMiddleName(String applicantMiddleName) {
        this.applicantMiddleName = applicantMiddleName;
    }

    public String getApplicantLastName() {
        return applicantLastName;
    }

    public void setApplicantLastName(String applicantLastName) {
        this.applicantLastName = applicantLastName;
    }

    public String getFatherFirstName() {
        return fatherFirstName;
    }

    public void setFatherFirstName(String fatherFirstName) {
        this.fatherFirstName = fatherFirstName;
    }

    public String getFatherMiddleName() {
        return fatherMiddleName;
    }

    public void setFatherMiddleName(String fatherMiddleName) {
        this.fatherMiddleName = fatherMiddleName;
    }

    public String getFatherLastName() {
        return fatherLastName;
    }

    public void setFatherLastName(String fatherLastName) {
        this.fatherLastName = fatherLastName;
    }

    public String getMotherFirstName() {
        return motherFirstName;
    }

    public void setMotherFirstName(String motherFirstName) {
        this.motherFirstName = motherFirstName;
    }

    public String getMotherMiddleName() {
        return motherMiddleName;
    }

    public void setMotherMiddleName(String motherMiddleName) {
        this.motherMiddleName = motherMiddleName;
    }

    public String getMotherLastName() {
        return motherLastName;
    }

    public void setMotherLastName(String motherLastName) {
        this.motherLastName = motherLastName;
    }

    public String getLocalAddress() {
        return localAddress;
    }

    public void setLocalAddress(String localAddress) {
        this.localAddress = localAddress;
    }

    public String getLocalTal() {
        return localTal;
    }

    public void setLocalTal(String localTal) {
        this.localTal = localTal;
    }

    public String getLocalDist() {
        return localDist;
    }

    public void setLocalDist(String localDist) {
        this.localDist = localDist;
    }

    public String getLocalPinCode() {
        return localPinCode;
    }

    public void setLocalPinCode(String localPinCode) {
        this.localPinCode = localPinCode;
    }

    public String getPermanentAddress() {
        return permanentAddress;
    }

    public void setPermanentAddress(String permanentAddress) {
        this.permanentAddress = permanentAddress;
    }

    public String getPermanentTal() {
        return permanentTal;
    }

    public void setPermanentTal(String permanentTal) {
        this.permanentTal = permanentTal;
    }

    public String getPermanentDist() {
        return permanentDist;
    }

    public void setPermanentDist(String permanentDist) {
        this.permanentDist = permanentDist;
    }

    public String getPermanentPinCode() {
        return permanentPinCode;
    }

    public void setPermanentPinCode(String permanentPinCode) {
        this.permanentPinCode = permanentPinCode;
    }

    public String getMobileNo() {
        return mobileNo;
    }

    public void setMobileNo(String mobileNo) {
        this.mobileNo = mobileNo;
    }

    public String getStudentEmail() {
        return studentEmail;
    }

    public void setStudentEmail(String studentEmail) {
        this.studentEmail = studentEmail;
    }

    public String getGender() {
        return gender;
    }

    public void setGender(String gender) {
        this.gender = gender;
    }

    public LocalDate getDateOfBirth() {
        return dateOfBirth;
    }

    public void setDateOfBirth(LocalDate dateOfBirth) {
        this.dateOfBirth = dateOfBirth;
    }

    public String getBloodGroup() {
        return bloodGroup;
    }

    public void setBloodGroup(String bloodGroup) {
        this.bloodGroup = bloodGroup;
    }

    public String getAadhaarNo() {
        return aadhaarNo;
    }

    public void setAadhaarNo(String aadhaarNo) {
        this.aadhaarNo = aadhaarNo;
    }

    public String getEducationalQualification() {
        return educationalQualification;
    }

    public void setEducationalQualification(String educationalQualification) {
        this.educationalQualification = educationalQualification;
    }

    public String getInstituteName() {
        return instituteName;
    }

    public void setInstituteName(String instituteName) {
        this.instituteName = instituteName;
    }

    public String getPreviousProgramCode() {
        return previousProgramCode;
    }

    public void setPreviousProgramCode(String previousProgramCode) {
        this.previousProgramCode = previousProgramCode;
    }

    public Double getPreviousCGPA() {
        return previousCGPA;
    }

    public void setPreviousCGPA(Double previousCGPA) {
        this.previousCGPA = previousCGPA;
    }

    public Double getScienceMarks() {
        return scienceMarks;
    }

    public void setScienceMarks(Double scienceMarks) {
        this.scienceMarks = scienceMarks;
    }

    public String getProgram() {
        return program;
    }

    public void setProgram(String program) {
        this.program = program;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public String getCaste() {
        return caste;
    }

    public void setCaste(String caste) {
        this.caste = caste;
    }

    public String getAnnualIncome() {
        return annualIncome;
    }

    public void setAnnualIncome(String annualIncome) {
        this.annualIncome = annualIncome;
    }

    public String getPhysicallyHandicapped() {
        return physicallyHandicapped;
    }

    public void setPhysicallyHandicapped(String physicallyHandicapped) {
        this.physicallyHandicapped = physicallyHandicapped;
    }

    public String getAdmissionType() {
        return admissionType;
    }

    public void setAdmissionType(String admissionType) {
        this.admissionType = admissionType;
    }

    public Integer getPreference1() {
        return preference1;
    }

    public void setPreference1(Integer preference1) {
        this.preference1 = preference1;
    }

    public Integer getPreference2() {
        return preference2;
    }

    public void setPreference2(Integer preference2) {
        this.preference2 = preference2;
    }

    public Integer getPreference3() {
        return preference3;
    }

    public void setPreference3(Integer preference3) {
        this.preference3 = preference3;
    }

    public Integer getPreference4() {
        return preference4;
    }

    public void setPreference4(Integer preference4) {
        this.preference4 = preference4;
    }

    public String getDomicileCertificatePath() {
        return domicileCertificatePath;
    }

    public void setDomicileCertificatePath(String domicileCertificatePath) {
        this.domicileCertificatePath = domicileCertificatePath;
    }

    public String getSscMarkSheetPath() {
        return sscMarkSheetPath;
    }

    public void setSscMarkSheetPath(String sscMarkSheetPath) {
        this.sscMarkSheetPath = sscMarkSheetPath;
    }

    public String getHscMarkSheetPath() {
        return hscMarkSheetPath;
    }

    public void setHscMarkSheetPath(String hscMarkSheetPath) {
        this.hscMarkSheetPath = hscMarkSheetPath;
    }

    public String getCasteCertificatePath() {
        return casteCertificatePath;
    }

    public void setCasteCertificatePath(String casteCertificatePath) {
        this.casteCertificatePath = casteCertificatePath;
    }

    public String getNonCreamyLayerCertificatePath() {
        return nonCreamyLayerCertificatePath;
    }

    public void setNonCreamyLayerCertificatePath(String nonCreamyLayerCertificatePath) {
        this.nonCreamyLayerCertificatePath = nonCreamyLayerCertificatePath;
    }

    public String getAadhaarCardPath() {
        return aadhaarCardPath;
    }

    public void setAadhaarCardPath(String aadhaarCardPath) {
        this.aadhaarCardPath = aadhaarCardPath;
    }
}
