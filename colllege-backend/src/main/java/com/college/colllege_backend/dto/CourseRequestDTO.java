package com.college.colllege_backend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class CourseRequestDTO {
    @NotBlank(message = "Course code cannot be blank")
    private String code;

    @NotBlank(message = "Course name cannot be blank")
    private String name;

    @NotNull(message = "Duration is required")
    private Integer duration;

    private String description;

    // Getters and Setters
    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Integer getDuration() {
        return duration;
    }

    public void setDuration(Integer duration) {
        this.duration = duration;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }
}
