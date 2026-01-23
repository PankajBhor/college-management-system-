package com.college.colllege_backend.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;

@Entity
@Table(name = "users")
@Data
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(unique = true)
    private String email;
    
    private String password;
    
    // Your 5 roles from admission module
    @Column(nullable = false)
    private String role; // ENQUIRY_STAFF, OFFICE_STAFF, PRINCIPAL, HOD, FACULTY
    
    private String name;
}
