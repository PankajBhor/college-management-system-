package com.college.colllege_backend.service;

import com.college.colllege_backend.dto.LoginRequestDTO;
import com.college.colllege_backend.dto.LoginResponseDTO;
import com.college.colllege_backend.entity.User;

import java.util.Optional;

public interface AuthService {
    LoginResponseDTO login(LoginRequestDTO request);
    Optional<User> findByEmail(String email);
    boolean validatePassword(String rawPassword, String hashedPassword);
    String hashPassword(String password);
}
