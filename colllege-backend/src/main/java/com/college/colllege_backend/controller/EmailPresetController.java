package com.college.colllege_backend.controller;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.college.colllege_backend.dto.EmailPresetDTO;
import com.college.colllege_backend.dto.EmailSendRequestDTO;
import com.college.colllege_backend.entity.DSYAdmission;
import com.college.colllege_backend.entity.EmailPreset;
import com.college.colllege_backend.entity.Enquiry;
import com.college.colllege_backend.entity.FYAdmission;
import com.college.colllege_backend.repository.DSYAdmissionRepository;
import com.college.colllege_backend.repository.EmailPresetRepository;
import com.college.colllege_backend.repository.EnquiryRepository;
import com.college.colllege_backend.repository.FYAdmissionRepository;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;

@RestController
@RequestMapping("/api/email-presets")
@CrossOrigin(origins = "http://localhost:3000")
public class EmailPresetController {

    @Autowired
    private EmailPresetRepository emailPresetRepository;

    @Autowired
    private EnquiryRepository enquiryRepository;

    @Autowired
    private FYAdmissionRepository fyAdmissionRepository;

    @Autowired
    private DSYAdmissionRepository dsyAdmissionRepository;

    @Autowired
    private com.college.colllege_backend.service.EmailService emailService;

    @Value("${file.upload.dir:uploads}")
    private String uploadDir;

    private final ObjectMapper objectMapper = new ObjectMapper();

    @GetMapping
    public ResponseEntity<?> getPresets(@RequestParam(required = false) String targetScope, Authentication authentication) {
        String scope = normalizeScope(targetScope == null ? defaultScope(authentication) : targetScope);
        if (!canUseScope(authentication, scope)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(Map.of("error", "Email scope not allowed"));
        }
        return ResponseEntity.ok(emailPresetRepository.findByTargetScopeOrderByUpdatedAtDesc(scope).stream()
                .map(this::toDTO)
                .collect(Collectors.toList()));
    }

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> createPreset(
            @RequestParam String name,
            @RequestParam String subject,
            @RequestParam(required = false) String body,
            @RequestParam(defaultValue = "ENQUIRY") String targetScope,
            @RequestPart(required = false) List<MultipartFile> attachments,
            Authentication authentication) {
        String scope = normalizeScope(targetScope);
        if (!canUseScope(authentication, scope)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(Map.of("error", "Email scope not allowed"));
        }
        try {
            EmailPreset preset = new EmailPreset();
            preset.setName(name);
            preset.setSubject(subject);
            preset.setBody(body);
            preset.setTargetScope(scope);
            preset.setAttachmentsJson(objectMapper.writeValueAsString(saveAttachments(attachments)));
            return ResponseEntity.status(HttpStatus.CREATED).body(toDTO(emailPresetRepository.save(preset)));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PutMapping(value = "/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> updatePreset(
            @PathVariable Long id,
            @RequestParam String name,
            @RequestParam String subject,
            @RequestParam(required = false) String body,
            @RequestParam(defaultValue = "ENQUIRY") String targetScope,
            @RequestPart(required = false) List<MultipartFile> attachments,
            Authentication authentication) {
        String scope = normalizeScope(targetScope);
        if (!canUseScope(authentication, scope)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(Map.of("error", "Email scope not allowed"));
        }
        return emailPresetRepository.findById(id)
                .map(preset -> {
                    try {
                        preset.setName(name);
                        preset.setSubject(subject);
                        preset.setBody(body);
                        preset.setTargetScope(scope);
                        List<String> paths = parseAttachmentPaths(preset.getAttachmentsJson());
                        paths.addAll(saveAttachments(attachments));
                        preset.setAttachmentsJson(objectMapper.writeValueAsString(paths));
                        return ResponseEntity.ok(toDTO(emailPresetRepository.save(preset)));
                    } catch (Exception e) {
                        return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
                    }
                })
                .orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", "Preset not found")));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deletePreset(@PathVariable Long id, Authentication authentication) {
        return emailPresetRepository.findById(id)
                .map(preset -> {
                    if (!canUseScope(authentication, preset.getTargetScope())) {
                        return ResponseEntity.status(HttpStatus.FORBIDDEN).body(Map.of("error", "Email scope not allowed"));
                    }
                    emailPresetRepository.deleteById(id);
                    return ResponseEntity.ok(Map.of("success", true));
                })
                .orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", "Preset not found")));
    }

    @PostMapping("/send")
    public ResponseEntity<?> sendPreset(@org.springframework.web.bind.annotation.RequestBody EmailSendRequestDTO request, Authentication authentication) {
        return emailPresetRepository.findById(request.getPresetId())
                .map(preset -> {
                    String scope = normalizeScope(request.getTargetScope() == null ? preset.getTargetScope() : request.getTargetScope());
                    if (!canUseScope(authentication, scope) || !scope.equalsIgnoreCase(preset.getTargetScope())) {
                        return ResponseEntity.status(HttpStatus.FORBIDDEN).body(Map.of("error", "Email scope not allowed"));
                    }

                    List<String> recipients = "ADMISSION".equals(scope)
                            ? admissionRecipients(request)
                            : enquiryRecipients(request);
                    int sent = 0;
                    int failed = 0;
                    List<String> attachments = parseAttachmentPaths(preset.getAttachmentsJson());
                    for (String to : recipients) {
                        try {
                            emailService.sendEmail(to, preset.getSubject(), preset.getBody(), attachments);
                            sent++;
                        } catch (Exception e) {
                            failed++;
                        }
                    }
                    return ResponseEntity.ok(Map.of("sent", sent, "failed", failed, "recipients", recipients.size()));
                })
                .orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", "Preset not found")));
    }

    private List<String> enquiryRecipients(EmailSendRequestDTO request) {
        Set<String> recipients = new LinkedHashSet<>();
        for (Enquiry enquiry : enquiryRepository.findAll()) {
            if (!matches(request.getAdmissionFor(), enquiry.getAdmissionFor())) continue;
            if (!matches(request.getCategory(), enquiry.getCategory())) continue;
            if (!matches(request.getLocation(), enquiry.getLocation())) continue;
            if (!matches(request.getStatus(), enquiry.getStatus())) continue;
            if (request.getBranch() != null && !request.getBranch().isBlank()
                    && (enquiry.getBranchesInterested() == null || !enquiry.getBranchesInterested().contains(request.getBranch()))) continue;
            if (enquiry.getEmail() != null && !enquiry.getEmail().isBlank()) recipients.add(enquiry.getEmail());
        }
        return new ArrayList<>(recipients);
    }

    private List<String> admissionRecipients(EmailSendRequestDTO request) {
        Set<String> recipients = new LinkedHashSet<>();
        for (FYAdmission admission : fyAdmissionRepository.findAll()) {
            if (!matches(request.getCategory(), admission.getCategory())) continue;
            if (!matches(request.getStatus(), admission.getStatus())) continue;
            if (!matches(request.getAdmissionFor(), "FY")) continue;
            if (request.getBranch() != null && !request.getBranch().isBlank() && !matches(request.getBranch(), admission.getProgram())) continue;
            if (admission.getStudentEmail() != null && !admission.getStudentEmail().isBlank()) recipients.add(admission.getStudentEmail());
        }
        for (DSYAdmission admission : dsyAdmissionRepository.findAll()) {
            if (!matches(request.getCategory(), admission.getCategory())) continue;
            if (!matches(request.getStatus(), admission.getStatus())) continue;
            if (!matches(request.getAdmissionFor(), "DSY")) continue;
            if (request.getBranch() != null && !request.getBranch().isBlank() && !matches(request.getBranch(), admission.getProgram())) continue;
            if (admission.getStudentEmail() != null && !admission.getStudentEmail().isBlank()) recipients.add(admission.getStudentEmail());
        }
        return new ArrayList<>(recipients);
    }

    private boolean matches(String expected, String actual) {
        return expected == null || expected.isBlank() || (actual != null && actual.equalsIgnoreCase(expected));
    }

    private List<String> saveAttachments(List<MultipartFile> attachments) throws IOException {
        List<String> savedPaths = new ArrayList<>();
        if (attachments == null) {
            return savedPaths;
        }
        Path uploadPath = Paths.get(uploadDir, "email-presets");
        Files.createDirectories(uploadPath);
        for (MultipartFile file : attachments) {
            if (file == null || file.isEmpty()) {
                continue;
            }
            String contentType = file.getContentType();
            if (contentType == null || (!contentType.equals("application/pdf")
                    && !contentType.equals("image/png") && !contentType.equals("image/jpeg"))) {
                throw new IllegalArgumentException("Only PDF, PNG, and JPEG files are allowed");
            }
            String originalFileName = file.getOriginalFilename();
            String extension = originalFileName != null && originalFileName.contains(".")
                    ? originalFileName.substring(originalFileName.lastIndexOf("."))
                    : ".bin";
            Path filePath = uploadPath.resolve(UUID.randomUUID() + extension);
            Files.copy(file.getInputStream(), filePath);
            savedPaths.add(filePath.toString());
        }
        return savedPaths;
    }

    private List<String> parseAttachmentPaths(String attachmentsJson) {
        if (attachmentsJson == null || attachmentsJson.isBlank()) {
            return new ArrayList<>();
        }
        try {
            return objectMapper.readValue(attachmentsJson, new TypeReference<List<String>>() {});
        } catch (Exception e) {
            return new ArrayList<>();
        }
    }

    private String normalizeScope(String scope) {
        return "ADMISSION".equalsIgnoreCase(scope) ? "ADMISSION" : "ENQUIRY";
    }

    private String defaultScope(Authentication authentication) {
        return hasRole(authentication, "OFFICE_STAFF") ? "ADMISSION" : "ENQUIRY";
    }

    private boolean canUseScope(Authentication authentication, String scope) {
        if (authentication == null || !authentication.isAuthenticated()) {
            return false;
        }
        if (hasRole(authentication, "ADMIN") || hasRole(authentication, "PRINCIPAL")) {
            return true;
        }
        if ("ENQUIRY".equals(scope)) {
            return hasRole(authentication, "ENQUIRY_STAFF") || hasAuthority(authentication, "PAGE_email-enquiry");
        }
        return hasRole(authentication, "OFFICE_STAFF") || hasAuthority(authentication, "PAGE_email-admission");
    }

    private boolean hasRole(Authentication authentication, String role) {
        return hasAuthority(authentication, "ROLE_" + role);
    }

    private boolean hasAuthority(Authentication authentication, String authority) {
        return authentication.getAuthorities().stream().anyMatch(item -> authority.equals(item.getAuthority()));
    }

    private EmailPresetDTO toDTO(EmailPreset preset) {
        EmailPresetDTO dto = new EmailPresetDTO();
        dto.setId(preset.getId());
        dto.setName(preset.getName());
        dto.setSubject(preset.getSubject());
        dto.setBody(preset.getBody());
        dto.setTargetScope(preset.getTargetScope());
        dto.setAttachmentsJson(preset.getAttachmentsJson());
        dto.setCreatedAt(preset.getCreatedAt());
        dto.setUpdatedAt(preset.getUpdatedAt());
        return dto;
    }
}
