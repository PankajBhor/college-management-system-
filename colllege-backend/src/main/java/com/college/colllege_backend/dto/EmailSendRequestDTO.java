package com.college.colllege_backend.dto;

public class EmailSendRequestDTO {
    private Long presetId;
    private String targetScope;
    private String admissionFor;
    private String branch;
    private String category;
    private String location;
    private String status;

    public Long getPresetId() { return presetId; }
    public void setPresetId(Long presetId) { this.presetId = presetId; }
    public String getTargetScope() { return targetScope; }
    public void setTargetScope(String targetScope) { this.targetScope = targetScope; }
    public String getAdmissionFor() { return admissionFor; }
    public void setAdmissionFor(String admissionFor) { this.admissionFor = admissionFor; }
    public String getBranch() { return branch; }
    public void setBranch(String branch) { this.branch = branch; }
    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }
    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
}
