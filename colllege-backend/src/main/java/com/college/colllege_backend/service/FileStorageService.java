package com.college.colllege_backend.service;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

@Service
public class FileStorageService {

    @Value("${file.upload.dir:uploads}")
    private String uploadDir;

    public String saveFile(MultipartFile file, String admissionType, String admissionId) throws IOException {
        if (file == null || file.isEmpty()) {
            return null;
        }

        // Validate file type (PDF and images only)
        String contentType = file.getContentType();
        if (contentType == null || (!contentType.equals("application/pdf")
                && !contentType.equals("image/png")
                && !contentType.equals("image/jpeg"))) {
            throw new IllegalArgumentException("Only PDF, PNG, and JPEG files are allowed");
        }

        // Create directory structure: uploads/admissions/FY_<admissionId>/ or uploads/admissions/DSY_<admissionId>/
        String dirPath = uploadDir + "/admissions/" + admissionType + "_" + admissionId;
        Path uploadPath = Paths.get(dirPath);

        // Create directories if they don't exist
        if (!Files.exists(uploadPath)) {
            Files.createDirectories(uploadPath);
        }

        // Generate unique filename to avoid conflicts
        String originalFileName = file.getOriginalFilename();
        String fileExtension = originalFileName != null && originalFileName.contains(".")
                ? originalFileName.substring(originalFileName.lastIndexOf("."))
                : ".bin";
        String uniqueFileName = UUID.randomUUID().toString() + fileExtension;

        // Save file
        Path filePath = uploadPath.resolve(uniqueFileName);
        Files.copy(file.getInputStream(), filePath);

        // Return the relative path for storage in database
        return dirPath + "/" + uniqueFileName;
    }

    public void deleteFile(String filePath) {
        if (filePath == null || filePath.isEmpty()) {
            return;
        }

        try {
            Path path = Paths.get(filePath);
            if (Files.exists(path)) {
                Files.delete(path);
            }
        } catch (IOException e) {
            // Log error but don't throw - file deletion failure shouldn't block the process
            System.err.println("Failed to delete file: " + filePath + " - " + e.getMessage());
        }
    }
}
