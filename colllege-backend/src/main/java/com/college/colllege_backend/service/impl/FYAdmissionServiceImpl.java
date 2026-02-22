package com.college.colllege_backend.service.impl;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.college.colllege_backend.dto.FYAdmissionRequestDTO;
import com.college.colllege_backend.entity.FYAdmission;
import com.college.colllege_backend.repository.FYAdmissionRepository;
import com.college.colllege_backend.service.FYAdmissionService;

@Service
public class FYAdmissionServiceImpl implements FYAdmissionService {

    @Autowired
    private FYAdmissionRepository fyAdmissionRepository;

    @Override
    public FYAdmission createFYAdmission(FYAdmissionRequestDTO request) {
        FYAdmission admission = new FYAdmission();
        admission.setApplicantFirstName(request.getApplicantFirstName());
        admission.setApplicantMiddleName(request.getApplicantMiddleName());
        admission.setApplicantLastName(request.getApplicantLastName());
        admission.setFatherFirstName(request.getFatherFirstName());
        admission.setFatherMiddleName(request.getFatherMiddleName());
        admission.setFatherLastName(request.getFatherLastName());
        admission.setMotherFirstName(request.getMotherFirstName());
        admission.setMotherMiddleName(request.getMotherMiddleName());
        admission.setMotherLastName(request.getMotherLastName());
        admission.setVillageCity(request.getVillageCity());
        admission.setTal(request.getTal());
        admission.setDist(request.getDist());
        admission.setPinCode(request.getPinCode());
        admission.setOccupation(request.getOccupation());
        admission.setMobileNo(request.getMobileNo());
        admission.setStudentEmail(request.getStudentEmail());
        admission.setGender(request.getGender());
        admission.setDateOfBirth(request.getDateOfBirth());
        admission.setBloodGroup(request.getBloodGroup());
        admission.setAadhaarNo(request.getAadhaarNo());
        admission.setSchoolName(request.getSchoolName());
        admission.setYop(request.getYop());
        admission.setMarksObtained(request.getMarksObtained());
        admission.setTotalMarks(request.getTotalMarks());
        admission.setEnglishMarks(request.getEnglishMarks());
        admission.setMathMarks(request.getMathMarks());
        admission.setScienceMarks(request.getScienceMarks());
        admission.setBestOfFiveMarks(request.getBestOfFiveMarks());
        admission.setProgram(request.getProgram());
        admission.setCategory(request.getCategory());
        admission.setCaste(request.getCaste());
        admission.setAnnualIncome(request.getAnnualIncome());
        admission.setPhysicallyHandicapped(request.getPhysicallyHandicapped());
        admission.setAdmissionType(request.getAdmissionType());
        admission.setStatus("PENDING");
        admission.setCreatedAt(LocalDateTime.now());
        admission.setUpdatedAt(LocalDateTime.now());

        return fyAdmissionRepository.save(admission);
    }

    @Override
    public FYAdmission getFYAdmissionById(Long id) {
        return fyAdmissionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("FY Admission not found with id: " + id));
    }

    @Override
    public List<FYAdmission> getAllFYAdmissions() {
        return fyAdmissionRepository.findAll();
    }

    @Override
    public List<FYAdmission> getFYAdmissionsByStatus(String status) {
        return fyAdmissionRepository.findByStatus(status);
    }

    @Override
    public List<FYAdmission> getFYAdmissionsByAdmissionType(String admissionType) {
        return fyAdmissionRepository.findByAdmissionType(admissionType);
    }

    @Override
    public FYAdmission updateFYAdmission(Long id, FYAdmissionRequestDTO request) {
        FYAdmission admission = getFYAdmissionById(id);
        admission.setApplicantFirstName(request.getApplicantFirstName());
        admission.setApplicantMiddleName(request.getApplicantMiddleName());
        admission.setApplicantLastName(request.getApplicantLastName());
        admission.setFatherFirstName(request.getFatherFirstName());
        admission.setFatherMiddleName(request.getFatherMiddleName());
        admission.setFatherLastName(request.getFatherLastName());
        admission.setMotherFirstName(request.getMotherFirstName());
        admission.setMotherMiddleName(request.getMotherMiddleName());
        admission.setMotherLastName(request.getMotherLastName());
        admission.setVillageCity(request.getVillageCity());
        admission.setTal(request.getTal());
        admission.setDist(request.getDist());
        admission.setPinCode(request.getPinCode());
        admission.setOccupation(request.getOccupation());
        admission.setMobileNo(request.getMobileNo());
        admission.setStudentEmail(request.getStudentEmail());
        admission.setGender(request.getGender());
        admission.setDateOfBirth(request.getDateOfBirth());
        admission.setBloodGroup(request.getBloodGroup());
        admission.setAadhaarNo(request.getAadhaarNo());
        admission.setSchoolName(request.getSchoolName());
        admission.setYop(request.getYop());
        admission.setMarksObtained(request.getMarksObtained());
        admission.setTotalMarks(request.getTotalMarks());
        admission.setEnglishMarks(request.getEnglishMarks());
        admission.setMathMarks(request.getMathMarks());
        admission.setScienceMarks(request.getScienceMarks());
        admission.setBestOfFiveMarks(request.getBestOfFiveMarks());
        admission.setProgram(request.getProgram());
        admission.setCategory(request.getCategory());
        admission.setCaste(request.getCaste());
        admission.setAnnualIncome(request.getAnnualIncome());
        admission.setPhysicallyHandicapped(request.getPhysicallyHandicapped());
        admission.setAdmissionType(request.getAdmissionType());
        
        // Set file paths
        admission.setDomicileCertificatePath(request.getDomicileCertificatePath());
        admission.setTenthMarkSheetPath(request.getTenthMarkSheetPath());
        admission.setTwelfthMarkSheetPath(request.getTwelfthMarkSheetPath());
        admission.setLeavingCertificatePath(request.getLeavingCertificatePath());
        admission.setCasteCertificatePath(request.getCasteCertificatePath());
        admission.setNonCreamyLayerCertificatePath(request.getNonCreamyLayerCertificatePath());
        admission.setIncomeCertificatePath(request.getIncomeCertificatePath());
        admission.setDefenceCertificatePath(request.getDefenceCertificatePath());
        admission.setAadhaarCardPath(request.getAadhaarCardPath());
        admission.setAnyOtherDocumentPath(request.getAnyOtherDocumentPath());
        
        admission.setUpdatedAt(LocalDateTime.now());

        return fyAdmissionRepository.save(admission);
    }

    @Override
    public void deleteFYAdmission(Long id) {
        fyAdmissionRepository.deleteById(id);
    }
}
