package com.college.colllege_backend.entity;

import java.time.LocalDate;
import java.time.LocalDateTime;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Index;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

@Entity
@Table(name = "fy_admissions", indexes = {
    @Index(name = "idx_fy_status", columnList = "status"),
    @Index(name = "idx_fy_category", columnList = "category"),
    @Index(name = "idx_fy_admission_type", columnList = "admission_type")
})
public class FYAdmission {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

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

    @NotBlank(message = "Village/City cannot be blank")
    private String villageCity;

    private String tal;
    private String dist;
    private String pinCode;

    private String occupation;
    private String mobileNo;
    private String studentEmail;

    @NotNull(message = "Gender cannot be null")
    private String gender; // Male, Female, Other

    @NotNull(message = "Date of birth cannot be null")
    private LocalDate dateOfBirth;

    private String bloodGroup;

    private String aadhaarNo;

    // Previous Examination Details (SSC)
    private String schoolName;
    private Integer yop; // Year of Passing
    private Double marksObtained;
    private Double totalMarks;
    private Double englishMarks;
    private Double mathMarks;
    private Double scienceMarks;
    private Double bestOfFiveMarks;

    @NotNull(message = "Program cannot be null")
    private String program; // 1. Civil Engg, 2. Computer Engineering, etc.

    private String category; // General, OBC, etc.
    private String caste;
    private Double annualIncome;

    private String physicallyHandicapped; // Yes/No

    @NotNull(message = "Admission type cannot be null")
    private String admissionType; // CAP-1, CAP-2, CAP-3, etc.

    // Document File Paths
    private String domicileCertificatePath;
    private String tenthMarkSheetPath;
    private String twelfthMarkSheetPath;
    private String leavingCertificatePath;
    private String casteCertificatePath;
    private String nonCreamyLayerCertificatePath;
    private String incomeCertificatePath;
    private String defenceCertificatePath;
    private String aadhaarCardPath;
    private String anyOtherDocumentPath;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private String status; // PENDING, APPROVED, REJECTED

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

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

    public String getVillageCity() {
        return villageCity;
    }

    public void setVillageCity(String villageCity) {
        this.villageCity = villageCity;
    }

    public String getTal() {
        return tal;
    }

    public void setTal(String tal) {
        this.tal = tal;
    }

    public String getDist() {
        return dist;
    }

    public void setDist(String dist) {
        this.dist = dist;
    }

    public String getPinCode() {
        return pinCode;
    }

    public void setPinCode(String pinCode) {
        this.pinCode = pinCode;
    }

    public String getOccupation() {
        return occupation;
    }

    public void setOccupation(String occupation) {
        this.occupation = occupation;
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

    public String getSchoolName() {
        return schoolName;
    }

    public void setSchoolName(String schoolName) {
        this.schoolName = schoolName;
    }

    public Integer getYop() {
        return yop;
    }

    public void setYop(Integer yop) {
        this.yop = yop;
    }

    public Double getMarksObtained() {
        return marksObtained;
    }

    public void setMarksObtained(Double marksObtained) {
        this.marksObtained = marksObtained;
    }

    public Double getTotalMarks() {
        return totalMarks;
    }

    public void setTotalMarks(Double totalMarks) {
        this.totalMarks = totalMarks;
    }

    public Double getEnglishMarks() {
        return englishMarks;
    }

    public void setEnglishMarks(Double englishMarks) {
        this.englishMarks = englishMarks;
    }

    public Double getMathMarks() {
        return mathMarks;
    }

    public void setMathMarks(Double mathMarks) {
        this.mathMarks = mathMarks;
    }

    public Double getScienceMarks() {
        return scienceMarks;
    }

    public void setScienceMarks(Double scienceMarks) {
        this.scienceMarks = scienceMarks;
    }

    public Double getBestOfFiveMarks() {
        return bestOfFiveMarks;
    }

    public void setBestOfFiveMarks(Double bestOfFiveMarks) {
        this.bestOfFiveMarks = bestOfFiveMarks;
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

    public Double getAnnualIncome() {
        return annualIncome;
    }

    public void setAnnualIncome(Double annualIncome) {
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

    public String getDomicileCertificatePath() {
        return domicileCertificatePath;
    }

    public void setDomicileCertificatePath(String domicileCertificatePath) {
        this.domicileCertificatePath = domicileCertificatePath;
    }

    public String getTenthMarkSheetPath() {
        return tenthMarkSheetPath;
    }

    public void setTenthMarkSheetPath(String tenthMarkSheetPath) {
        this.tenthMarkSheetPath = tenthMarkSheetPath;
    }

    public String getTwelfthMarkSheetPath() {
        return twelfthMarkSheetPath;
    }

    public void setTwelfthMarkSheetPath(String twelfthMarkSheetPath) {
        this.twelfthMarkSheetPath = twelfthMarkSheetPath;
    }

    public String getLeavingCertificatePath() {
        return leavingCertificatePath;
    }

    public void setLeavingCertificatePath(String leavingCertificatePath) {
        this.leavingCertificatePath = leavingCertificatePath;
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

    public String getIncomeCertificatePath() {
        return incomeCertificatePath;
    }

    public void setIncomeCertificatePath(String incomeCertificatePath) {
        this.incomeCertificatePath = incomeCertificatePath;
    }

    public String getDefenceCertificatePath() {
        return defenceCertificatePath;
    }

    public void setDefenceCertificatePath(String defenceCertificatePath) {
        this.defenceCertificatePath = defenceCertificatePath;
    }

    public String getAadhaarCardPath() {
        return aadhaarCardPath;
    }

    public void setAadhaarCardPath(String aadhaarCardPath) {
        this.aadhaarCardPath = aadhaarCardPath;
    }

    public String getAnyOtherDocumentPath() {
        return anyOtherDocumentPath;
    }

    public void setAnyOtherDocumentPath(String anyOtherDocumentPath) {
        this.anyOtherDocumentPath = anyOtherDocumentPath;
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

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}
