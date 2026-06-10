package com.college.colllege_backend.dto;

public class UserResponseDTO {
    private Long id;
    private String name;
    private String email;
    private String role;
    private String departmentCode;
    private String accessPages;
    private String profileImagePath;

    // Constructor
    public UserResponseDTO() {}

    public UserResponseDTO(Long id, String name, String email, String role) {
        this(id, name, email, role, null);
    }

    public UserResponseDTO(Long id, String name, String email, String role, String departmentCode) {
        this(id, name, email, role, departmentCode, null);
    }

    public UserResponseDTO(Long id, String name, String email, String role, String departmentCode, String accessPages) {
        this(id, name, email, role, departmentCode, accessPages, null);
    }

    public UserResponseDTO(Long id, String name, String email, String role, String departmentCode, String accessPages, String profileImagePath) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.role = role;
        this.departmentCode = departmentCode;
        this.accessPages = accessPages;
        this.profileImagePath = profileImagePath;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }
    public String getDepartmentCode() {
        return departmentCode;
    }

    public void setDepartmentCode(String departmentCode) {
        this.departmentCode = departmentCode;
    }

    public String getAccessPages() {
        return accessPages;
    }

    public void setAccessPages(String accessPages) {
        this.accessPages = accessPages;
    }

    public String getProfileImagePath() {
        return profileImagePath;
    }

    public void setProfileImagePath(String profileImagePath) {
        this.profileImagePath = profileImagePath;
    }
}

