package com.college.colllege_backend.exception;

/**
 * Exception thrown when a resource is not found
 */
public class ResourceNotFoundException extends ApplicationException {

    public ResourceNotFoundException(String message) {
        super(message, 404);
    }

    public ResourceNotFoundException(String resourceName, Long id) {
        super(resourceName + " with ID " + id + " not found", 404);
    }

    public ResourceNotFoundException(String resourceName, String fieldName, String fieldValue) {
        super(resourceName + " with " + fieldName + " '" + fieldValue + "' not found", 404);
    }
}
