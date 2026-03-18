package com.college.colllege_backend.exception;

/**
 * Custom base exception for application
 */
public class ApplicationException extends RuntimeException {

    private int statusCode;

    public ApplicationException(String message) {
        super(message);
        this.statusCode = 500;
    }

    public ApplicationException(String message, int statusCode) {
        super(message);
        this.statusCode = statusCode;
    }

    public ApplicationException(String message, Throwable cause) {
        super(message, cause);
        this.statusCode = 500;
    }

    public ApplicationException(String message, int statusCode, Throwable cause) {
        super(message, cause);
        this.statusCode = statusCode;
    }

    public int getStatusCode() {
        return statusCode;
    }
}
