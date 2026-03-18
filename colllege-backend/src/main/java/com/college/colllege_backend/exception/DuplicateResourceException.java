package com.college.colllege_backend.exception;

/**
 * Exception thrown when a duplicate resource is attempted to be created
 */
public class DuplicateResourceException extends ApplicationException {

    public DuplicateResourceException(String message) {
        super(message, 409);
    }

    public DuplicateResourceException(String resourceName, String fieldName, String fieldValue) {
        super(resourceName + " with " + fieldName + " '" + fieldValue + "' already exists", 409);
    }
}
