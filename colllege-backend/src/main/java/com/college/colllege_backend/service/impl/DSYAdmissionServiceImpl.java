package com.college.colllege_backend.service.impl;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.college.colllege_backend.dto.DSYAdmissionRequestDTO;
import com.college.colllege_backend.entity.DSYAdmission;
import com.college.colllege_backend.repository.DSYAdmissionRepository;
import com.college.colllege_backend.service.DSYAdmissionService;

@Service
@Transactional
public class DSYAdmissionServiceImpl implements DSYAdmissionService {

    @Autowired
    private DSYAdmissionRepository dsyAdmissionRepository;

    @Override
    public DSYAdmission createDSYAdmission(DSYAdmissionRequestDTO request) {
        DSYAdmission admission = new DSYAdmission();
        admission.setApplicantFirstName(request.getApplicantFirstName());
        admission.setApplicantMiddleName(request.getApplicantMiddleName());
        admission.setApplicantLastName(request.getApplicantLastName());
        admission.setFatherFirstName(request.getFatherFirstName());
        admission.setFatherMiddleName(request.getFatherMiddleName());
        admission.setFatherLastName(request.getFatherLastName());
        admission.setMotherFirstName(request.getMotherFirstName());
        admission.setMotherMiddleName(request.getMotherMiddleName());
        admission.setMotherLastName(request.getMotherLastName());
        admission.setLocalAddress(request.getLocalAddress());
        admission.setLocalTal(request.getLocalTal());
        admission.setLocalDist(request.getLocalDist());
        admission.setLocalPinCode(request.getLocalPinCode());
        admission.setPermanentAddress(request.getPermanentAddress());
        admission.setPermanentTal(request.getPermanentTal());
        admission.setPermanentDist(request.getPermanentDist());
        admission.setPermanentPinCode(request.getPermanentPinCode());
        admission.setMobileNo(request.getMobileNo());
        admission.setStudentEmail(request.getStudentEmail());
        admission.setGender(request.getGender());
        admission.setDateOfBirth(request.getDateOfBirth());
        admission.setBloodGroup(request.getBloodGroup());
        admission.setAadhaarNo(request.getAadhaarNo());
        admission.setEducationalQualification(request.getEducationalQualification());
        admission.setInstituteName(request.getInstituteName());
        admission.setPreviousProgramCode(request.getPreviousProgramCode());
        admission.setPreviousCGPA(request.getPreviousCGPA());
        admission.setScienceMarks(request.getScienceMarks());
        admission.setProgram(request.getProgram());
        admission.setCategory(request.getCategory());
        admission.setCaste(request.getCaste());
        admission.setAnnualIncome(request.getAnnualIncome());
        admission.setPhysicallyHandicapped(request.getPhysicallyHandicapped());
        admission.setAdmissionType(request.getAdmissionType());
        admission.setPreference1(request.getPreference1());
        admission.setPreference2(request.getPreference2());
        admission.setPreference3(request.getPreference3());
        admission.setPreference4(request.getPreference4());
        admission.setStatus("PENDING");
        admission.setCreatedAt(LocalDateTime.now());
        admission.setUpdatedAt(LocalDateTime.now());

        return dsyAdmissionRepository.save(admission);
    }

    @Override
    public DSYAdmission getDSYAdmissionById(Long id) {
        return dsyAdmissionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("DSY Admission not found with id: " + id));
    }

    @Override
    public List<DSYAdmission> getAllDSYAdmissions() {
        return dsyAdmissionRepository.findAll();
    }

    @Transactional(readOnly = true)
    public Page<DSYAdmission> getAllDSYAdmissionsPaginated(Pageable pageable) {
        return dsyAdmissionRepository.findAll(pageable);
    }

    @Override
    public List<DSYAdmission> getDSYAdmissionsByStatus(String status) {
        return dsyAdmissionRepository.findByStatus(status);
    }

    @Transactional(readOnly = true)
    public Page<DSYAdmission> getDSYAdmissionsByStatusPaginated(String status, Pageable pageable) {
        return dsyAdmissionRepository.findByStatus(status, pageable);
    }

    @Override
    public List<DSYAdmission> getDSYAdmissionsByAdmissionType(String admissionType) {
        return dsyAdmissionRepository.findByAdmissionType(admissionType);
    }

    @Transactional(readOnly = true)
    public Page<DSYAdmission> getDSYAdmissionsByAdmissionTypePaginated(String admissionType, Pageable pageable) {
        return dsyAdmissionRepository.findByAdmissionType(admissionType, pageable);
    }

    @Override
    public DSYAdmission updateDSYAdmission(Long id, DSYAdmissionRequestDTO request) {
        DSYAdmission admission = getDSYAdmissionById(id);
        admission.setApplicantFirstName(request.getApplicantFirstName());
        admission.setApplicantMiddleName(request.getApplicantMiddleName());
        admission.setApplicantLastName(request.getApplicantLastName());
        admission.setFatherFirstName(request.getFatherFirstName());
        admission.setFatherMiddleName(request.getFatherMiddleName());
        admission.setFatherLastName(request.getFatherLastName());
        admission.setMotherFirstName(request.getMotherFirstName());
        admission.setMotherMiddleName(request.getMotherMiddleName());
        admission.setMotherLastName(request.getMotherLastName());
        admission.setLocalAddress(request.getLocalAddress());
        admission.setLocalTal(request.getLocalTal());
        admission.setLocalDist(request.getLocalDist());
        admission.setLocalPinCode(request.getLocalPinCode());
        admission.setPermanentAddress(request.getPermanentAddress());
        admission.setPermanentTal(request.getPermanentTal());
        admission.setPermanentDist(request.getPermanentDist());
        admission.setPermanentPinCode(request.getPermanentPinCode());
        admission.setMobileNo(request.getMobileNo());
        admission.setStudentEmail(request.getStudentEmail());
        admission.setGender(request.getGender());
        admission.setDateOfBirth(request.getDateOfBirth());
        admission.setBloodGroup(request.getBloodGroup());
        admission.setAadhaarNo(request.getAadhaarNo());
        admission.setEducationalQualification(request.getEducationalQualification());
        admission.setInstituteName(request.getInstituteName());
        admission.setPreviousProgramCode(request.getPreviousProgramCode());
        admission.setPreviousCGPA(request.getPreviousCGPA());
        admission.setScienceMarks(request.getScienceMarks());
        admission.setProgram(request.getProgram());
        admission.setCategory(request.getCategory());
        admission.setCaste(request.getCaste());
        admission.setAnnualIncome(request.getAnnualIncome());
        admission.setPhysicallyHandicapped(request.getPhysicallyHandicapped());
        admission.setAdmissionType(request.getAdmissionType());
        admission.setPreference1(request.getPreference1());
        admission.setPreference2(request.getPreference2());
        admission.setPreference3(request.getPreference3());
        admission.setPreference4(request.getPreference4());

        // Set file paths
        admission.setDomicileCertificatePath(request.getDomicileCertificatePath());
        admission.setSscMarkSheetPath(request.getSscMarkSheetPath());
        admission.setHscMarkSheetPath(request.getHscMarkSheetPath());
        admission.setCasteCertificatePath(request.getCasteCertificatePath());
        admission.setNonCreamyLayerCertificatePath(request.getNonCreamyLayerCertificatePath());
        admission.setAadhaarCardPath(request.getAadhaarCardPath());

        admission.setUpdatedAt(LocalDateTime.now());

        return dsyAdmissionRepository.save(admission);
    }

    @Override
    public void deleteDSYAdmission(Long id) {
        dsyAdmissionRepository.deleteById(id);
    }
}
