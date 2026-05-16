package com.college.colllege_backend.dto;

import java.time.LocalDateTime;

public class EmailPresetDTO {
    private Long id;
    private String name;
    private String subject;
    private String body;
    private String targetScope;
    private String attachmentsJson;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getSubject() { return subject; }
    public void setSubject(String subject) { this.subject = subject; }
    public String getBody() { return body; }
    public void setBody(String body) { this.body = body; }
    public String getTargetScope() { return targetScope; }
    public void setTargetScope(String targetScope) { this.targetScope = targetScope; }
    public String getAttachmentsJson() { return attachmentsJson; }
    public void setAttachmentsJson(String attachmentsJson) { this.attachmentsJson = attachmentsJson; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}
