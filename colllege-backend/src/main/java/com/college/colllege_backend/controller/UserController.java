package com.college.colllege_backend.controller;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.multipart.MultipartFile;
import jakarta.validation.Valid;

import com.college.colllege_backend.dto.LoginRequestDTO;
import com.college.colllege_backend.dto.LoginResponseDTO;
import com.college.colllege_backend.dto.UserRequestDTO;
import com.college.colllege_backend.dto.UserResponseDTO;
import com.college.colllege_backend.entity.User;
import com.college.colllege_backend.enums.UserRole;
import com.college.colllege_backend.repository.UserRepository;
import com.college.colllege_backend.service.AutoIncrementService;
import com.college.colllege_backend.service.AuthService;
import com.college.colllege_backend.service.FileStorageService;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "http://localhost:3000")
public class UserController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private AuthService authService;

    @Autowired
    private AutoIncrementService autoIncrementService;

    @Autowired
    private FileStorageService fileStorageService;

    @GetMapping
    public List<UserResponseDTO> getAllUsers() {
        return userRepository.findAll().stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody LoginRequestDTO request) {
        try {
            LoginResponseDTO response = authService.login(request);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("{\"error\": \"" + e.getMessage() + "\"}");
        }
    }

    @PostMapping({"/register", ""})
    public ResponseEntity<?> createUser(@Valid @RequestBody UserRequestDTO request) {
        try {
            UserRole role = UserRole.fromString(request.getRole());

            if (request.getPassword() == null || request.getPassword().isBlank()) {
                return ResponseEntity.badRequest().body("{\"error\": \"Password cannot be blank\"}");
            }

            if (userRepository.findByEmail(request.getEmail()).isPresent()) {
                return ResponseEntity.badRequest().body("{\"error\": \"Email already exists\"}");
            }

            User user = new User();
            user.setName(request.getName());
            user.setEmail(request.getEmail());
            user.setRole(role.name());
            user.setDepartmentCode(request.getDepartmentCode());
            user.setAccessPages(request.getAccessPages());
            user.setProfileImagePath(request.getProfileImagePath());
            user.setPassword(authService.hashPassword(request.getPassword()));

            User saved = userRepository.save(user);
            return ResponseEntity.ok(toResponse(saved));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("{\"error\": \"" + e.getMessage() + "\"}");
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateUser(@PathVariable Long id, @Valid @RequestBody UserRequestDTO request) {
        try {
            User user = userRepository.findById(id)
                    .orElseThrow(() -> new IllegalArgumentException("User not found"));
            UserRole role = UserRole.fromString(request.getRole());
            userRepository.findByEmail(request.getEmail())
                    .filter(existing -> !existing.getId().equals(id))
                    .ifPresent(existing -> {
                        throw new IllegalArgumentException("Email already exists");
                    });

            user.setName(request.getName());
            user.setEmail(request.getEmail());
            user.setRole(role.name());
            user.setDepartmentCode(request.getDepartmentCode());
            user.setAccessPages(request.getAccessPages());
            if (request.getProfileImagePath() != null) {
                user.setProfileImagePath(request.getProfileImagePath());
            }
            if (request.getPassword() != null && !request.getPassword().isBlank()) {
                user.setPassword(authService.hashPassword(request.getPassword()));
            }

            User saved = userRepository.save(user);
            return ResponseEntity.ok(toResponse(saved));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("{\"error\": \"" + e.getMessage() + "\"}");
        }
    }

    @PostMapping("/{id}/profile-image")
    public ResponseEntity<?> uploadProfileImage(@PathVariable Long id, @RequestPart("image") MultipartFile image) {
        try {
            User user = userRepository.findById(id)
                    .orElseThrow(() -> new IllegalArgumentException("User not found"));
            String role = String.valueOf(user.getRole());
            if (!role.equals("PRINCIPAL") && !role.equals("HOD")) {
                return ResponseEntity.badRequest().body("{\"error\": \"Images can be uploaded only for Principal and HOD users\"}");
            }

            String previousPath = user.getProfileImagePath();
            String imagePath = fileStorageService.saveUserProfileImage(image, id.toString());
            user.setProfileImagePath(imagePath);
            User saved = userRepository.save(user);
            if (previousPath != null && !previousPath.isBlank()) {
                fileStorageService.deleteFile(previousPath);
            }
            return ResponseEntity.ok(toResponse(saved));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("{\"error\": \"" + e.getMessage() + "\"}");
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteUser(@PathVariable Long id) {
        if (!userRepository.existsById(id)) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("{\"error\": \"User not found\"}");
        }
        userRepository.deleteById(id);
        autoIncrementService.resetNextId("users");
        return ResponseEntity.noContent().build();
    }

    private UserResponseDTO toResponse(User user) {
        return new UserResponseDTO(user.getId(), user.getName(), user.getEmail(), user.getRole(), user.getDepartmentCode(), user.getAccessPages(), user.getProfileImagePath());
    }
}



