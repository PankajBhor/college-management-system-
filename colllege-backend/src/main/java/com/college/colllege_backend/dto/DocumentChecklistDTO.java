package com.college.colllege_backend.dto;

public class DocumentChecklistDTO {

    private Long id;
    private String admissionType;
    private String documentName;
    private Boolean isRequired;
    private Integer sequenceOrder;

    public DocumentChecklistDTO() {
    }

    public DocumentChecklistDTO(String admissionType, String documentName, Boolean isRequired, Integer sequenceOrder) {
        this.admissionType = admissionType;
        this.documentName = documentName;
        this.isRequired = isRequired;
        this.sequenceOrder = sequenceOrder;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getAdmissionType() {
        return admissionType;
    }

    public void setAdmissionType(String admissionType) {
        this.admissionType = admissionType;
    }

    public String getDocumentName() {
        return documentName;
    }

    public void setDocumentName(String documentName) {
        this.documentName = documentName;
    }

    public Boolean getIsRequired() {
        return isRequired;
    }

    public void setIsRequired(Boolean isRequired) {
        this.isRequired = isRequired;
    }

    public Integer getSequenceOrder() {
        return sequenceOrder;
    }

    public void setSequenceOrder(Integer sequenceOrder) {
        this.sequenceOrder = sequenceOrder;
    }
}
