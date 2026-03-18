package com.college.colllege_backend.enums;

/**
 * Admission status enumeration - Fixed to use single source of truth
 */
public enum AdmissionStatus {
    PENDING("Pending"),
    APPROVED("Approved"),
    REJECTED("Rejected"),
    SUCCESS("Success"),
    INCOMPLETE("Incomplete");

    private final String displayName;

    AdmissionStatus(String displayName) {
        this.displayName = displayName;
    }

    public String getDisplayName() {
        return displayName;
    }

    public static AdmissionStatus fromString(String value) {
        if (value == null) {
            return PENDING;
        }
        for (AdmissionStatus status : AdmissionStatus.values()) {
            if (status.displayName.equalsIgnoreCase(value) || status.name().equalsIgnoreCase(value)) {
                return status;
            }
        }
        return PENDING;
    }
}
