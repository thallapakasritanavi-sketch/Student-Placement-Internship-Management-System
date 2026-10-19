package com.sritanavi.placement.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;
import java.time.LocalDateTime;

public class PlacementDriveDto {
    private Long id;

    @NotBlank(message = "Company name is required")
    private String companyName;

    @NotBlank(message = "Job position is required")
    private String jobPosition;

    @NotNull(message = "Drive date is required")
    private LocalDate driveDate;

    private LocalDate registrationDeadline;
    private String location;
    private String eligibility;
    private String requiredSkills;
    private String packageAmount;
    private String description;
    private String status = "UPCOMING";
    private LocalDateTime createdAt;

    public PlacementDriveDto() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getCompanyName() { return companyName; }
    public void setCompanyName(String companyName) { this.companyName = companyName; }

    public String getJobPosition() { return jobPosition; }
    public void setJobPosition(String jobPosition) { this.jobPosition = jobPosition; }

    public LocalDate getDriveDate() { return driveDate; }
    public void setDriveDate(LocalDate driveDate) { this.driveDate = driveDate; }

    public LocalDate getRegistrationDeadline() { return registrationDeadline; }
    public void setRegistrationDeadline(LocalDate registrationDeadline) { this.registrationDeadline = registrationDeadline; }

    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }

    public String getEligibility() { return eligibility; }
    public void setEligibility(String eligibility) { this.eligibility = eligibility; }

    public String getRequiredSkills() { return requiredSkills; }
    public void setRequiredSkills(String requiredSkills) { this.requiredSkills = requiredSkills; }

    public String getPackageAmount() { return packageAmount; }
    public void setPackageAmount(String packageAmount) { this.packageAmount = packageAmount; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
