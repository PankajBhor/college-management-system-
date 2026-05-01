package com.college.colllege_backend.enums;

/**
 * User role enumeration
 */
public enum UserRole {
    PRINCIPAL("Principal"),
    OFFICE_STAFF("Office Staff"),
    HOD("Head of Department"),
    ENQUIRY_STAFF("Enquiry Staff"),
    FACULTY("Faculty");

    private final String displayName;

    UserRole(String displayName) {
        this.displayName = displayName;
    }

    public String getDisplayName() {
        return displayName;
    }

    public static UserRole fromString(String value) {
        if (value == null) {
            throw new IllegalArgumentException("Role is required");
        }
        try {
            return UserRole.valueOf(value.toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new IllegalArgumentException("Invalid role: " + value);
        }
    }
}
