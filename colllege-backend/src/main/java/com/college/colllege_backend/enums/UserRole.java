package com.college.colllege_backend.enums;

/**
 * User role enumeration
 */
public enum UserRole {
    PRINCIPAL("Principal"),
    ADMIN("Admin"),
    STAFF("Office Staff"),
    ENQUIRY_STAFF("Enquiry Staff"),
    FACULTY("Faculty"),
    HOD("Head of Department"),
    STUDENT("Student");

    private final String displayName;

    UserRole(String displayName) {
        this.displayName = displayName;
    }

    public String getDisplayName() {
        return displayName;
    }

    public static UserRole fromString(String value) {
        if (value == null) {
            return STUDENT;
        }
        try {
            return UserRole.valueOf(value.toUpperCase());
        } catch (IllegalArgumentException e) {
            return STUDENT;
        }
    }
}
