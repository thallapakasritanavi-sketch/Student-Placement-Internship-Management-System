package com.sritanavi.placement.dto;

import jakarta.validation.constraints.NotBlank;
import java.time.LocalDate;
import java.time.LocalDateTime;

public class InternshipDto {
    private Long id;

    @NotBlank(message = "Internship title is required")
    private String title;

    @NotBlank(message = "Company name is required")
    private String company;

    private String location;
    private String duration = "3 Months";
    private String stipend;
    private Double minCgpa = 6.0;
    private String requiredSkills;
    private String description;
    private LocalDate deadline;
    private Integer openings = 1;
    private String status = "ACTIVE";
    private LocalDateTime createdAt;
    private boolean appliedByCurrentStudent;

    public InternshipDto() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getCompany() { return company; }
    public void setCompany(String company) { this.company = company; }

    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }

    public String getDuration() { return duration; }
    public void setDuration(String duration) { this.duration = duration; }

    public String getStipend() { return stipend; }
    public void setStipend(String stipend) { this.stipend = stipend; }

    public Double getMinCgpa() { return minCgpa; }
    public void setMinCgpa(Double minCgpa) { this.minCgpa = minCgpa; }

    public String getRequiredSkills() { return requiredSkills; }
    public void setRequiredSkills(String requiredSkills) { this.requiredSkills = requiredSkills; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public LocalDate getDeadline() { return deadline; }
    public void setDeadline(LocalDate deadline) { this.deadline = deadline; }

    public Integer getOpenings() { return openings; }
    public void setOpenings(Integer openings) { this.openings = openings; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public boolean isAppliedByCurrentStudent() { return appliedByCurrentStudent; }
    public void setAppliedByCurrentStudent(boolean appliedByCurrentStudent) { this.appliedByCurrentStudent = appliedByCurrentStudent; }
}
