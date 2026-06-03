package com.college.colllege_backend.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import com.college.colllege_backend.entity.Course;
import com.college.colllege_backend.entity.LookupOption;
import com.college.colllege_backend.entity.ReferenceFaculty;
import com.college.colllege_backend.entity.User;
import com.college.colllege_backend.repository.CourseRepository;
import com.college.colllege_backend.repository.LookupOptionRepository;
import com.college.colllege_backend.repository.ReferenceFacultyRepository;
import com.college.colllege_backend.repository.UserRepository;

@Configuration
public class DataInitializer {

    @Bean
    CommandLineRunner seedDatabaseMetadata(
            CourseRepository courseRepository,
            LookupOptionRepository lookupOptionRepository,
            ReferenceFacultyRepository referenceFacultyRepository,
            UserRepository userRepository,
            PasswordEncoder passwordEncoder,
            @Value("${app.seed.default-user-password:password}") String defaultUserPassword) {
        return args -> {
            migrateLegacyPlainTextPasswords(userRepository, passwordEncoder);

            seedUser(userRepository, passwordEncoder, "System Admin", "admin@college.com", "ADMIN", null, defaultUserPassword);
            seedUser(userRepository, passwordEncoder, "Dr. Pankaj Sharma", "principal@college.com", "PRINCIPAL", null, defaultUserPassword);
            seedUser(userRepository, passwordEncoder, "Priya Office", "office@college.com", "OFFICE_STAFF", null, defaultUserPassword);
            seedUser(userRepository, passwordEncoder, "Rahul Enquiry", "enquiry@college.com", "ENQUIRY_STAFF", null, defaultUserPassword);
            seedUser(userRepository, passwordEncoder, "Academic Coordinator", "academic@college.com", "ACADEMIC_COORDINATOR", null, defaultUserPassword);
            seedUser(userRepository, passwordEncoder, "Dr. Civil HOD", "hod-civil@college.com", "HOD", "1", defaultUserPassword);
            seedUser(userRepository, passwordEncoder, "Dr. Computer HOD", "hod-computer@college.com", "HOD", "2", defaultUserPassword);
            seedUser(userRepository, passwordEncoder, "Dr. Electrical HOD", "hod-electrical@college.com", "HOD", "3", defaultUserPassword);
            seedUser(userRepository, passwordEncoder, "Dr. ENTC HOD", "hod-entc@college.com", "HOD", "4", defaultUserPassword);
            seedUser(userRepository, passwordEncoder, "Dr. Mechanical HOD", "hod-mechanical@college.com", "HOD", "5", defaultUserPassword);
            seedUser(userRepository, passwordEncoder, "Dr. IT HOD", "hod-it@college.com", "HOD", "6", defaultUserPassword);
            seedUser(userRepository, passwordEncoder, "Dr. Mechatronics HOD", "hod-mechatronics@college.com", "HOD", "7", defaultUserPassword);
            seedUser(userRepository, passwordEncoder, "Prof. Anita", "faculty@college.com", "FACULTY", "2", defaultUserPassword);

            seedCourse(courseRepository, "1", "Civil Engineering", 3);
            seedCourse(courseRepository, "2", "Computer Engineering", 3);
            seedCourse(courseRepository, "3", "Electrical Engineering", 3);
            seedCourse(courseRepository, "4", "Electronics and Telecommunication Engineering", 3);
            seedCourse(courseRepository, "5", "Mechanical Engineering", 3);
            seedCourse(courseRepository, "6", "Information Technology", 3);
            seedCourse(courseRepository, "7", "Mechatronics Engineering", 3);

            seedLookup(lookupOptionRepository, "admission_types", "FY", "FY", 1);
            seedLookup(lookupOptionRepository, "admission_types", "DSY", "DSY", 2);

            seedLookup(lookupOptionRepository, "categories", "OPEN", "OPEN", 1);
            seedLookup(lookupOptionRepository, "categories", "OBC", "OBC", 2);
            seedLookup(lookupOptionRepository, "categories", "SC", "SC", 3);
            seedLookup(lookupOptionRepository, "categories", "ST", "ST", 4);
            seedLookup(lookupOptionRepository, "categories", "NT", "NT", 6);
            seedLookup(lookupOptionRepository, "categories", "SBC", "SBC", 7);
            deactivateLookup(lookupOptionRepository, "categories", "EWS");
            deactivateLookup(lookupOptionRepository, "categories", "TFWS");

            seedLookup(lookupOptionRepository, "locations", "AHMEDNAGAR", "Ahmednagar", 1);
            seedLookup(lookupOptionRepository, "locations", "PUNE", "Pune", 2);
            seedLookup(lookupOptionRepository, "locations", "NASHIK", "Nashik", 3);
            seedLookup(lookupOptionRepository, "locations", "MUMBAI", "Mumbai", 4);
            seedLookup(lookupOptionRepository, "locations", "OTHER", "Other", 99);

            seedLookup(lookupOptionRepository, "enquiry_statuses", "Pending", "Pending", 1);
            seedLookup(lookupOptionRepository, "enquiry_statuses", "Success", "Success", 2);
            deactivateLookup(lookupOptionRepository, "enquiry_statuses", "Follow-up");
            deactivateLookup(lookupOptionRepository, "enquiry_statuses", "Converted");
            deactivateLookup(lookupOptionRepository, "enquiry_statuses", "Lost");

            seedLookup(lookupOptionRepository, "admission_rounds", "CAP-1", "CAP-1", 1);
            seedLookup(lookupOptionRepository, "admission_rounds", "CAP-2", "CAP-2", 2);
            seedLookup(lookupOptionRepository, "admission_rounds", "CAP-3", "CAP-3", 3);
            seedLookup(lookupOptionRepository, "admission_rounds", "EWS", "EWS", 4);
            seedLookup(lookupOptionRepository, "admission_rounds", "TFWS", "TFWS", 5);
            seedLookup(lookupOptionRepository, "admission_rounds", "INSTITUTE_LEVEL", "Institute Level", 6);
            seedLookup(lookupOptionRepository, "admission_rounds", "AGAINST_CAP", "Against CAP", 7);

            seedLookup(lookupOptionRepository, "genders", "Male", "Male", 1);
            seedLookup(lookupOptionRepository, "genders", "Female", "Female", 2);
            seedLookup(lookupOptionRepository, "genders", "Other", "Other", 3);

            seedLookup(lookupOptionRepository, "blood_groups", "A+", "A+", 1);
            seedLookup(lookupOptionRepository, "blood_groups", "A-", "A-", 2);
            seedLookup(lookupOptionRepository, "blood_groups", "B+", "B+", 3);
            seedLookup(lookupOptionRepository, "blood_groups", "B-", "B-", 4);
            seedLookup(lookupOptionRepository, "blood_groups", "AB+", "AB+", 5);
            seedLookup(lookupOptionRepository, "blood_groups", "AB-", "AB-", 6);
            seedLookup(lookupOptionRepository, "blood_groups", "O+", "O+", 7);
            seedLookup(lookupOptionRepository, "blood_groups", "O-", "O-", 8);

            seedLookup(lookupOptionRepository, "yes_no", "Yes", "Yes", 1);
            seedLookup(lookupOptionRepository, "yes_no", "No", "No", 2);

            seedLookup(lookupOptionRepository, "educational_qualifications", "HSC", "HSC", 1);
            seedLookup(lookupOptionRepository, "educational_qualifications", "HSC_SCI", "HSC Sci", 2);
            seedLookup(lookupOptionRepository, "educational_qualifications", "VOC", "VOC", 3);
            seedLookup(lookupOptionRepository, "educational_qualifications", "MVCJ", "MVCJ", 4);
            seedLookup(lookupOptionRepository, "educational_qualifications", "JCOE", "JCOE", 5);
            seedLookup(lookupOptionRepository, "educational_qualifications", "DPO", "D/P/O", 6);
            seedLookup(lookupOptionRepository, "educational_qualifications", "ITI", "ITI", 7);
            seedLookup(lookupOptionRepository, "educational_qualifications", "COE", "COE", 8);

            seedReferenceFaculty(referenceFacultyRepository, "Prof. Anita", "Computer Engineering", "faculty@college.com");
            seedReferenceFaculty(referenceFacultyRepository, "Prof. Rahul Patil", "Civil Engineering", "rahul.patil@college.com");
            seedReferenceFaculty(referenceFacultyRepository, "Prof. Neha Deshmukh", "Electronics and Telecommunication Engineering", "neha.deshmukh@college.com");
        };
    }

    private void seedCourse(CourseRepository repository, String code, String name, Integer duration) {
        if (repository.findByCode(code).isPresent()) {
            return;
        }
        Course course = new Course(code, name, duration);
        repository.save(course);
    }

    private void seedLookup(
            LookupOptionRepository repository,
            String type,
            String code,
            String label,
            Integer displayOrder) {
        var existing = repository.findByTypeAndCode(type, code);
        if (existing.isPresent()) {
            LookupOption option = existing.get();
            boolean changed = false;
            if (!label.equals(option.getLabel())) {
                option.setLabel(label);
                changed = true;
            }
            if (!displayOrder.equals(option.getDisplayOrder())) {
                option.setDisplayOrder(displayOrder);
                changed = true;
            }
            if (!Boolean.TRUE.equals(option.getActive())) {
                option.setActive(true);
                changed = true;
            }
            if (changed) {
                repository.save(option);
            }
            return;
        }
        repository.save(new LookupOption(type, code, label, displayOrder));
    }

    private void deactivateLookup(LookupOptionRepository repository, String type, String code) {
        repository.findByTypeAndCode(type, code).ifPresent(option -> {
            if (Boolean.TRUE.equals(option.getActive())) {
                option.setActive(false);
                repository.save(option);
            }
        });
    }

    private void seedUser(
            UserRepository repository,
            PasswordEncoder passwordEncoder,
            String name,
            String email,
            String role,
            String departmentCode,
            String password) {
        String accessPages = defaultAccessPages(role);
        var existing = repository.findByEmail(email);
        if (existing.isPresent()) {
            User user = existing.get();
            String normalizedAccessPages = normalizeAccessPages(user.getAccessPages(), accessPages);
            if (!normalizedAccessPages.equals(user.getAccessPages())) {
                user.setAccessPages(normalizedAccessPages);
                repository.save(user);
            }
            return;
        }
        User user = new User();
        user.setName(name);
        user.setEmail(email);
        user.setRole(role);
        user.setDepartmentCode(departmentCode);
        user.setPassword(passwordEncoder.encode(password));
        user.setAccessPages(accessPages);
        repository.save(user);
    }

    private String defaultAccessPages(String role) {
        return switch (role) {
            case "ADMIN" -> "dashboard,admissions,enquiries,new-enquiry,update-enquiry,provisional-admission,email-enquiry,email-admission,analysis,staff,students,courses,fees";
            case "PRINCIPAL" -> "dashboard,admissions,enquiries,new-enquiry,update-enquiry,provisional-admission,email-enquiry,email-admission,analysis,staff";
            case "OFFICE_STAFF" -> "dashboard,admissions,provisional-admission,email-admission,analysis";
            case "ENQUIRY_STAFF" -> "dashboard,enquiries,new-enquiry,update-enquiry,provisional-admission,email-enquiry,analysis";
            case "ACADEMIC_COORDINATOR" -> "dashboard,admissions,enquiries,analysis";
            case "HOD" -> "dashboard,hod-admissions,hod-enquiries,analysis";
            case "FACULTY" -> "dashboard,students,courses";
            default -> "dashboard";
        };
    }

    private String normalizeAccessPages(String currentAccessPages, String defaultAccessPages) {
        if (currentAccessPages == null || currentAccessPages.isBlank()) {
            return defaultAccessPages;
        }
        return java.util.Arrays.stream(currentAccessPages.split(","))
                .map(String::trim)
                .filter(page -> !page.isBlank())
                .flatMap(page -> "email".equals(page)
                        ? java.util.stream.Stream.of("email-enquiry", "email-admission")
                        : java.util.stream.Stream.of(page))
                .distinct()
                .collect(java.util.stream.Collectors.joining(","));
    }

    private void seedReferenceFaculty(ReferenceFacultyRepository repository, String name, String department, String email) {
        if (repository.findByEmail(email).isPresent()) {
            return;
        }
        repository.save(new ReferenceFaculty(name, department, email));
    }

    private void migrateLegacyPlainTextPasswords(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        for (User user : userRepository.findAll()) {
            String password = user.getPassword();
            if (password == null || password.isBlank() || isBCryptHash(password)) {
                continue;
            }
            user.setPassword(passwordEncoder.encode(password));
            userRepository.save(user);
        }
    }

    private boolean isBCryptHash(String password) {
        return password.startsWith("$2a$") || password.startsWith("$2b$") || password.startsWith("$2y$");
    }
}




