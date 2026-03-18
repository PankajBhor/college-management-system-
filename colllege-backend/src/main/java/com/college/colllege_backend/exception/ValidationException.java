package com.college.colllege_backend.exception;

/**
 * Exception thrown when validation fails
 */
public class ValidationException extends ApplicationException {

    public ValidationException(String message) {
        super(message, 400);
    }

    public ValidationException(String fieldName, String message) {
        super("Validation error in " + fieldName + ": " + message, 400);
    }
}
