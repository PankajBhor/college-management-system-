package com.college.colllege_backend.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import java.util.stream.Stream;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.college.colllege_backend.entity.Course;
import com.college.colllege_backend.entity.DSYAdmission;
import com.college.colllege_backend.entity.Enquiry;
import com.college.colllege_backend.entity.FYAdmission;
import com.college.colllege_backend.entity.User;
import com.college.colllege_backend.repository.CourseRepository;
import com.college.colllege_backend.repository.DSYAdmissionRepository;
import com.college.colllege_backend.repository.EnquiryRepository;
import com.college.colllege_backend.repository.FYAdmissionRepository;
import com.college.colllege_backend.repository.UserRepository;

@RestController
@RequestMapping("/api/hod")
@CrossOrigin(origins = "http://localhost:3000")
public class HodController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private CourseRepository courseRepository;

    @Autowired
    private FYAdmissionRepository fyAdmissionRepository;

    @Autowired
    private DSYAdmissionRepository dsyAdmissionRepository;

    @Autowired
    private EnquiryRepository enquiryRepository;

    @GetMapping("/overview")
    public ResponseEntity<?> getOverview(Authentication authentication) {
        User hod = getCurrentUser(authentication);
        Course department = getDepartment(hod);

        List<FYAdmission> fyAdmissions = fyAdmissionRepository.findAll().stream()
                .filter(admission -> belongsToDepartment(admission.getProgram(), department))
                .collect(Collectors.toList());
        List<DSYAdmission> dsyAdmissions = dsyAdmissionRepository.findAll().stream()
                .filter(admission -> belongsToDepartment(admission.getProgram(), department))
                .collect(Collectors.toList());
        List<Enquiry> enquiries = enquiryRepository.findAll().stream()
                .filter(enquiry -> enquiryMatchesDepartment(enquiry, department))
                .collect(Collectors.toList());

        Map<String, Object> response = new HashMap<>();
        response.put("department", department);
        response.put("fyAdmissions", fyAdmissions);
        response.put("dsyAdmissions", dsyAdmissions);
        response.put("enquiries", enquiries);
        response.put("analytics", buildAnalytics(fyAdmissions, dsyAdmissions, enquiries));
        return ResponseEntity.ok(response);
    }

    private User getCurrentUser(Authentication authentication) {
        if (authentication == null || authentication.getName() == null) {
            throw new IllegalArgumentException("Authenticated HOD is required");
        }
        return userRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new IllegalArgumentException("Authenticated user not found"));
    }

    private Course getDepartment(User hod) {
        String departmentCode = hod.getDepartmentCode();
        if (departmentCode == null || departmentCode.isBlank()) {
            throw new IllegalArgumentException("No department is assigned to this HOD login");
        }
        return courseRepository.findByCode(departmentCode)
                .orElseThrow(() -> new IllegalArgumentException("Assigned department does not exist: " + departmentCode));
    }

    private boolean belongsToDepartment(String value, Course department) {
        String normalized = normalize(value);
        return !normalized.isBlank()
                && (normalized.contains(normalize(department.getCode())) || normalized.contains(normalize(department.getName())));
    }

    private boolean enquiryMatchesDepartment(Enquiry enquiry, Course department) {
        return belongsToDepartment(enquiry.getBranchesInterested(), department);
    }

    private Map<String, Object> buildAnalytics(List<FYAdmission> fyAdmissions, List<DSYAdmission> dsyAdmissions, List<Enquiry> enquiries) {
        List<Object> admissions = Stream.concat(fyAdmissions.stream(), dsyAdmissions.stream()).collect(Collectors.toList());
        Map<String, Object> analytics = new HashMap<>();
        analytics.put("admissionStatus", countBy(admissions, item -> item instanceof FYAdmission ? ((FYAdmission) item).getStatus() : ((DSYAdmission) item).getStatus()));
        analytics.put("admissionCategory", countBy(admissions, item -> item instanceof FYAdmission ? ((FYAdmission) item).getCategory() : ((DSYAdmission) item).getCategory()));
        analytics.put("admissionType", countBy(admissions, item -> item instanceof FYAdmission ? ((FYAdmission) item).getAdmissionType() : ((DSYAdmission) item).getAdmissionType()));
        analytics.put("enquiryStatus", countBy(enquiries, Enquiry::getStatus));
        analytics.put("enquiryCategory", countBy(enquiries, Enquiry::getCategory));
        analytics.put("enquiryAdmissionFor", countBy(enquiries, Enquiry::getAdmissionFor));
        analytics.put("enquiryLocation", countBy(enquiries, Enquiry::getLocation));
        return analytics;
    }

    private <T> Map<String, Long> countBy(List<T> values, java.util.function.Function<T, String> classifier) {
        return values.stream().collect(Collectors.groupingBy(value -> label(classifier.apply(value)), Collectors.counting()));
    }

    private String label(String value) {
        return value == null || value.isBlank() ? "Unknown" : value;
    }

    private String normalize(String value) {
        return value == null ? "" : value.toLowerCase().replaceAll("[^a-z0-9]", "");
    }
}
