package com.college.colllege_backend.dto;

import java.util.ArrayList;
import java.util.List;

public class BulkUploadResultDTO {
    private int totalRows;
    private int successCount;
    private int failedCount;
    private List<String> errors = new ArrayList<>();

    public int getTotalRows() {
        return totalRows;
    }

    public void setTotalRows(int totalRows) {
        this.totalRows = totalRows;
    }

    public int getSuccessCount() {
        return successCount;
    }

    public void setSuccessCount(int successCount) {
        this.successCount = successCount;
    }

    public int getFailedCount() {
        return failedCount;
    }

    public void setFailedCount(int failedCount) {
        this.failedCount = failedCount;
    }

    public List<String> getErrors() {
        return errors;
    }

    public void setErrors(List<String> errors) {
        this.errors = errors;
    }

    public void addSuccess() {
        this.successCount++;
    }

    public void addError(int rowNumber, String message) {
        this.failedCount++;
        this.errors.add("Row " + rowNumber + ": " + message);
    }
}
