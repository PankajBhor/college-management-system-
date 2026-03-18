package com.college.colllege_backend.enums;

/**
 * Student category enumeration
 */
public enum StudentCategory {
    GENERAL("General"),
    OBC("OBC"),
    SC("SC"),
    ST("ST"),
    EWS("EWS"),
    DEFENSE("Defence");

    private final String displayName;

    StudentCategory(String displayName) {
        this.displayName = displayName;
    }

    public String getDisplayName() {
        return displayName;
    }

    public static StudentCategory fromString(String value) {
        if (value == null) {
            return GENERAL;
        }
        for (StudentCategory category : StudentCategory.values()) {
            if (category.displayName.equalsIgnoreCase(value) || category.name().equalsIgnoreCase(value)) {
                return category;
            }
        }
        return GENERAL;
    }
}
