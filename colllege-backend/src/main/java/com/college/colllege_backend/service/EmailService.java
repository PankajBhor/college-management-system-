package com.college.colllege_backend.service;

public interface EmailService {

    void sendEmail(String to, String subject, String body);

    void sendEmail(String to, String subject, String body, java.util.List<String> attachmentPaths);
}
