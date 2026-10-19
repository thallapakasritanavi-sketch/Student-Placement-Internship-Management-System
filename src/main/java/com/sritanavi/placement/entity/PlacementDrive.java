package com.sritanavi.placement.entity;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "placement_drives")
public class PlacementDrive {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "company_name", nullable = false, length = 150)
    private String companyName;

    @Column(name = "job_position", nullable = false, length = 150)
    private String jobPosition;

    @Column(name = "drive_date", nullable = false)
    private LocalDate driveDate;

    @Column(name = "registration_deadline")
    private LocalDate registrationDeadline;

    @Column(length = 150)
    private String location;

    @Column(length = 150)
    private String eligibility;

    @Column(name = "required_skills", columnDefinition = "TEXT")
    private String requiredSkills;

    @Column(name = "package_amount", length = 100)
    private String packageAmount;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(length = 30)
    private String status = "UPCOMING"; // UPCOMING, ONGOING, COMPLETED

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        if (createdAt == null) {
            createdAt = LocalDateTime.now();
        }
    }

    public PlacementDrive() {
    }

    public PlacementDrive(Long id, String companyName, String jobPosition, LocalDate driveDate, LocalDate registrationDeadline, String location, String eligibility, String requiredSkills, String packageAmount, String description, String status) {
        this.id = id;
        this.companyName = companyName;
        this.jobPosition = jobPosition;
        this.driveDate = driveDate;
        this.registrationDeadline = registrationDeadline;
        this.location = location;
        this.eligibility = eligibility;
        this.requiredSkills = requiredSkills;
        this.packageAmount = packageAmount;
        this.description = description;
        this.status = status;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getCompanyName() {
        return companyName;
    }

    public void setCompanyName(String companyName) {
        this.companyName = companyName;
    }

    public String getJobPosition() {
        return jobPosition;
    }

    public void setJobPosition(String jobPosition) {
        this.jobPosition = jobPosition;
    }

    public LocalDate getDriveDate() {
        return driveDate;
    }

    public void setDriveDate(LocalDate driveDate) {
        this.driveDate = driveDate;
    }

    public LocalDate getRegistrationDeadline() {
        return registrationDeadline;
    }

    public void setRegistrationDeadline(LocalDate registrationDeadline) {
        this.registrationDeadline = registrationDeadline;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public String getEligibility() {
        return eligibility;
    }

    public void setEligibility(String eligibility) {
        this.eligibility = eligibility;
    }

    public String getRequiredSkills() {
        return requiredSkills;
    }

    public void setRequiredSkills(String requiredSkills) {
        this.requiredSkills = requiredSkills;
    }

    public String getPackageAmount() {
        return packageAmount;
    }

    public void setPackageAmount(String packageAmount) {
        this.packageAmount = packageAmount;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
