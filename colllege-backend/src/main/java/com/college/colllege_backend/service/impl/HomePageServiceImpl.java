package com.college.colllege_backend.service.impl;

import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.college.colllege_backend.entity.HomePageContent;
import com.college.colllege_backend.entity.User;
import com.college.colllege_backend.repository.CourseRepository;
import com.college.colllege_backend.repository.HomePageContentRepository;
import com.college.colllege_backend.repository.UserRepository;
import com.college.colllege_backend.service.HomePageService;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;

@Service
public class HomePageServiceImpl implements HomePageService {

    private final HomePageContentRepository contentRepository;
    private final UserRepository userRepository;
    private final CourseRepository courseRepository;
    private final ObjectMapper objectMapper;

    public HomePageServiceImpl(
            HomePageContentRepository contentRepository,
            UserRepository userRepository,
            CourseRepository courseRepository,
            ObjectMapper objectMapper) {
        this.contentRepository = contentRepository;
        this.userRepository = userRepository;
        this.courseRepository = courseRepository;
        this.objectMapper = objectMapper;
    }

    @Override
    public Map<String, Object> getHomePage() {
        Map<String, String> content = getContentMap();
        Map<String, Object> response = new LinkedHashMap<>();
        response.put("hero", Map.of(
                "title", content.getOrDefault("heroTitle", "Jaihind Polytechnic, Kuran"),
                "tagline", content.getOrDefault("heroTagline", "Shaping industry-ready diploma engineers with discipline, skill and purpose."),
                "highlight", content.getOrDefault("heroHighlight", "Admissions, academics and student support under one connected campus system.")));
        response.put("about", content.getOrDefault("aboutText",
                "Jaihind Polytechnic, Kuran is committed to practical technical education, strong academic mentoring and career-focused student development. The institute encourages disciplined learning, hands-on laboratory work and responsible professional conduct. Our academic teams work with students to build confidence, clarity and employable skills for modern industry."));
        response.put("leadership", parseList(content.get("leadershipJson"), defaultLeadership()));
        response.put("principal", principal());
        response.put("hods", hods());
        response.put("developers", parseList(content.get("developersJson"), defaultDevelopers()));
        response.put("contact", parseMap(content.get("contactJson"), defaultContact()));
        return response;
    }

    @Override
    public Map<String, Object> updateHomePage(Map<String, Object> request) {
        save("heroTitle", stringValue(request.get("heroTitle")));
        save("heroTagline", stringValue(request.get("heroTagline")));
        save("heroHighlight", stringValue(request.get("heroHighlight")));
        save("aboutText", stringValue(request.get("aboutText")));
        saveJson("leadershipJson", request.get("leadership"));
        saveJson("developersJson", request.get("developers"));
        saveJson("contactJson", request.get("contact"));
        return getHomePage();
    }

    @Override
    public List<Map<String, Object>> getEditableContent() {
        Map<String, Object> homePage = getHomePage();
        Map<String, Object> hero = castMap(homePage.get("hero"));
        List<Map<String, Object>> fields = new ArrayList<>();
        fields.add(Map.of("key", "heroTitle", "value", hero.get("title")));
        fields.add(Map.of("key", "heroTagline", "value", hero.get("tagline")));
        fields.add(Map.of("key", "heroHighlight", "value", hero.get("highlight")));
        fields.add(Map.of("key", "aboutText", "value", homePage.get("about")));
        fields.add(Map.of("key", "leadership", "value", homePage.get("leadership")));
        fields.add(Map.of("key", "developers", "value", homePage.get("developers")));
        fields.add(Map.of("key", "contact", "value", homePage.get("contact")));
        return fields;
    }

    private Map<String, Object> principal() {
        return userRepository.findByRole("PRINCIPAL").stream()
                .findFirst()
                .map(user -> person(user, "Principal"))
                .orElse(Map.of(
                        "name", "Principal",
                        "designation", "Principal",
                        "summary", "Academic leader guiding institutional quality, student discipline and technical education outcomes.",
                        "imagePath", ""));
    }

    private List<Map<String, Object>> hods() {
        return userRepository.findByRole("HOD").stream()
                .map(user -> person(user, departmentName(user)))
                .collect(Collectors.toList());
    }

    private Map<String, Object> person(User user, String designation) {
        Map<String, Object> map = new LinkedHashMap<>();
        map.put("name", user.getName());
        map.put("designation", designation);
        map.put("email", user.getEmail());
        map.put("departmentCode", user.getDepartmentCode());
        map.put("imagePath", user.getProfileImagePath());
        map.put("summary", "Education and experience details can be updated from the home page information tab.");
        return map;
    }

    private String departmentName(User user) {
        if (user.getDepartmentCode() == null || user.getDepartmentCode().isBlank()) {
            return "Head of Department";
        }
        return courseRepository.findByCode(user.getDepartmentCode())
                .map(course -> "HOD - " + course.getName())
                .orElse("HOD - " + user.getDepartmentCode());
    }

    private Map<String, String> getContentMap() {
        return contentRepository.findAll().stream()
                .collect(Collectors.toMap(HomePageContent::getContentKey, HomePageContent::getContentValue));
    }

    private void save(String key, String value) {
        contentRepository.save(new HomePageContent(key, value == null ? "" : value));
    }

    private void saveJson(String key, Object value) {
        try {
            contentRepository.save(new HomePageContent(key, objectMapper.writeValueAsString(value)));
        } catch (Exception ex) {
            throw new IllegalArgumentException("Invalid content for " + key);
        }
    }

    private List<Map<String, Object>> parseList(String json, List<Map<String, Object>> fallback) {
        if (json == null || json.isBlank()) {
            return fallback;
        }
        try {
            return objectMapper.readValue(json, new TypeReference<List<Map<String, Object>>>() {});
        } catch (Exception ex) {
            return fallback;
        }
    }

    private Map<String, Object> parseMap(String json, Map<String, Object> fallback) {
        if (json == null || json.isBlank()) {
            return fallback;
        }
        try {
            return objectMapper.readValue(json, new TypeReference<Map<String, Object>>() {});
        } catch (Exception ex) {
            return fallback;
        }
    }

    @SuppressWarnings("unchecked")
    private Map<String, Object> castMap(Object value) {
        return value instanceof Map<?, ?> map ? (Map<String, Object>) map : Map.of();
    }

    private String stringValue(Object value) {
        return value == null ? "" : String.valueOf(value);
    }

    private List<Map<String, Object>> defaultLeadership() {
        return List.of(
                Map.of("name", "Founder", "designation", "Founder", "summary", "Visionary leadership focused on accessible technical education and community upliftment."),
                Map.of("name", "CEO", "designation", "Chief Executive Officer", "summary", "Guides institutional growth, operations and student-centered development."),
                Map.of("name", "Director", "designation", "Director", "summary", "Leads academic strategy, quality initiatives and industry-oriented learning."));
    }

    private List<Map<String, Object>> defaultDevelopers() {
        return List.of(
                Map.of("name", "Developer One", "role", "Full Stack Developer", "linkedin", "", "phone", "", "email", "developer1@example.com"),
                Map.of("name", "Developer Two", "role", "Full Stack Developer", "linkedin", "", "phone", "", "email", "developer2@example.com"));
    }

    private Map<String, Object> defaultContact() {
        return Map.of(
                "address", "Jaihind Polytechnic, Kuran, Tal. Junnar, Dist. Pune",
                "phones", List.of("+91 00000 00000"),
                "email", "info@jaihindpolytechnic.edu.in",
                "socialLinks", List.of());
    }
}
