package com.college.colllege_backend.controller;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import jakarta.validation.Valid;

import com.college.colllege_backend.dto.LoginRequestDTO;
import com.college.colllege_backend.dto.LoginResponseDTO;
import com.college.colllege_backend.dto.UserRequestDTO;
import com.college.colllege_backend.dto.UserResponseDTO;
import com.college.colllege_backend.entity.User;
import com.college.colllege_backend.enums.UserRole;
import com.college.colllege_backend.repository.UserRepository;
import com.college.colllege_backend.service.AuthService;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "http://localhost:3000")
public class UserController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private AuthService authService;

    @GetMapping
    public List<UserResponseDTO> getAllUsers() {
        return userRepository.findAll().stream()
                .map(u -> new UserResponseDTO(u.getId(), u.getName(), u.getEmail(), u.getRole()))
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

            if (userRepository.findByEmail(request.getEmail()).isPresent()) {
                return ResponseEntity.badRequest().body("{\"error\": \"Email already exists\"}");
            }

            User user = new User();
            user.setName(request.getName());
            user.setEmail(request.getEmail());
            user.setRole(role.name());
            user.setPassword(authService.hashPassword(request.getPassword()));

            User saved = userRepository.save(user);
            return ResponseEntity.ok(new UserResponseDTO(saved.getId(), saved.getName(), saved.getEmail(), saved.getRole()));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("{\"error\": \"" + e.getMessage() + "\"}");
        }
    }
}
