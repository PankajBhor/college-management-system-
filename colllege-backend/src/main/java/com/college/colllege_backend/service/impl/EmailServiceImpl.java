package com.college.colllege_backend.service.impl;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.college.colllege_backend.service.EmailService;

@Service
@Transactional(readOnly = true)
public class EmailServiceImpl implements EmailService {

    private static final Logger logger = LoggerFactory.getLogger(EmailServiceImpl.class);

    @Autowired
    private JavaMailSender mailSender;

    @Value("${spring.mail.username}")
    private String fromEmail;

    @Override
    public void sendEmail(String to, String subject, String body) {
        try {
            logger.info("=== EMAIL SERVICE CALLED ===");
            logger.info("From: {}", fromEmail);
            logger.info("To: {}", to);
            logger.info("Subject: {}", subject);

            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(fromEmail);
            message.setTo(to);
            message.setSubject(subject);
            message.setText(body);

            logger.info("Message object created, attempting to send...");
            mailSender.send(message);
            logger.info("=== EMAIL SENT SUCCESSFULLY ===");
        } catch (Exception e) {
            logger.error("=== EMAIL SENDING FAILED ===", e);
            logger.error("Error type: {}", e.getClass().getName());
            logger.error("Error message: {}", e.getMessage());
            throw e;
        }
    }
}
