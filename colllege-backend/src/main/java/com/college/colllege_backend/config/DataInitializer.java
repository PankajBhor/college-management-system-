package com.college.colllege_backend.config;

import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import com.college.colllege_backend.entity.Course;
import com.college.colllege_backend.entity.LookupOption;
import com.college.colllege_backend.entity.User;
import com.college.colllege_backend.repository.CourseRepository;
import com.college.colllege_backend.repository.LookupOptionRepository;
import com.college.colllege_backend.repository.UserRepository;

@Configuration
public class DataInitializer {

    @Bean
    CommandLineRunner seedDatabaseMetadata(
            CourseRepository courseRepository,
            LookupOptionRepository lookupOptionRepository,
            UserRepository userRepository,
            PasswordEncoder passwordEncoder) {
        return args -> {
            migrateLegacyPlainTextPasswords(userRepository, passwordEncoder);

            seedCourse(courseRepository, "1", "Civil Engineering", 3, "Diploma branch");
            seedCourse(courseRepository, "2", "Computer Engineering", 3, "Diploma branch");
            seedCourse(courseRepository, "3", "Electrical Engineering", 3, "Diploma branch");
            seedCourse(courseRepository, "4", "Electronics and Telecommunication Engineering", 3, "Diploma branch");
            seedCourse(courseRepository, "5", "Mechanical Engineering", 3, "Diploma branch");
            seedCourse(courseRepository, "6", "Information Technology", 3, "Diploma branch");
            seedCourse(courseRepository, "7", "Mechatronics Engineering", 3, "Diploma branch");

            seedLookup(lookupOptionRepository, "admission_types", "FY", "FY", 1);
            seedLookup(lookupOptionRepository, "admission_types", "DSY", "DSY", 2);

            seedLookup(lookupOptionRepository, "categories", "OPEN", "OPEN", 1);
            seedLookup(lookupOptionRepository, "categories", "OBC", "OBC", 2);
            seedLookup(lookupOptionRepository, "categories", "SC", "SC", 3);
            seedLookup(lookupOptionRepository, "categories", "ST", "ST", 4);
            seedLookup(lookupOptionRepository, "categories", "EWS", "EWS", 5);
            seedLookup(lookupOptionRepository, "categories", "NT", "NT", 6);
            seedLookup(lookupOptionRepository, "categories", "SBC", "SBC", 7);
            seedLookup(lookupOptionRepository, "categories", "TFWS", "TFWS", 8);

            seedLookup(lookupOptionRepository, "locations", "AHMEDNAGAR", "Ahmednagar", 1);
            seedLookup(lookupOptionRepository, "locations", "PUNE", "Pune", 2);
            seedLookup(lookupOptionRepository, "locations", "NASHIK", "Nashik", 3);
            seedLookup(lookupOptionRepository, "locations", "MUMBAI", "Mumbai", 4);
            seedLookup(lookupOptionRepository, "locations", "OTHER", "Other", 99);

            seedLookup(lookupOptionRepository, "enquiry_statuses", "Pending", "Pending", 1);
            seedLookup(lookupOptionRepository, "enquiry_statuses", "Success", "Success", 2);
            seedLookup(lookupOptionRepository, "enquiry_statuses", "Follow-up", "Follow-up", 3);
            seedLookup(lookupOptionRepository, "enquiry_statuses", "Converted", "Converted", 4);
            seedLookup(lookupOptionRepository, "enquiry_statuses", "Lost", "Lost", 5);

            seedLookup(lookupOptionRepository, "admission_rounds", "CAP-1", "CAP-1", 1);
            seedLookup(lookupOptionRepository, "admission_rounds", "CAP-2", "CAP-2", 2);
            seedLookup(lookupOptionRepository, "admission_rounds", "CAP-3", "CAP-3", 3);
            seedLookup(lookupOptionRepository, "admission_rounds", "INSTITUTE_LEVEL", "Institute Level", 4);
            seedLookup(lookupOptionRepository, "admission_rounds", "AGAINST_CAP", "Against CAP", 5);

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
        };
    }

    private void seedCourse(CourseRepository repository, String code, String name, Integer duration, String description) {
        if (repository.findByCode(code).isPresent()) {
            return;
        }
        Course course = new Course(code, name, duration);
        course.setDescription(description);
        repository.save(course);
    }

    private void seedLookup(
            LookupOptionRepository repository,
            String type,
            String code,
            String label,
            Integer displayOrder) {
        if (repository.existsByTypeAndCode(type, code)) {
            return;
        }
        repository.save(new LookupOption(type, code, label, displayOrder));
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
