package com.sritanavi.placement.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "students")
public class Student {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.EAGER, cascade = CascadeType.ALL)
    @JoinColumn(name = "user_id", referencedColumnName = "id", nullable = false)
    private User user;

    @Column(length = 150)
    private String college;

    @Column(length = 100)
    private String degree;

    @Column(length = 100)
    private String department;

    @Column(name = "graduation_year")
    private Integer graduationYear;

    @Column(name = "cgpa")
    private Double cgpa;

    @Column(length = 100)
    private String location;

    @Column(columnDefinition = "TEXT")
    private String skills;

    @Column(columnDefinition = "TEXT")
    private String certifications;

    @Column(columnDefinition = "TEXT")
    private String projects;

    @Column(name = "resume_url", length = 255)
    private String resumeUrl;

    @Column(name = "profile_completed")
    private Integer profileCompletedPercentage = 50;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
        calculateProfileCompletion();
    }

    public void calculateProfileCompletion() {
        int score = 20; // base user account
        if (college != null && !college.trim().isEmpty()) score += 15;
        if (department != null && !department.trim().isEmpty()) score += 15;
        if (degree != null && !degree.trim().isEmpty()) score += 10;
        if (cgpa != null && cgpa > 0) score += 10;
        if (graduationYear != null && graduationYear > 0) score += 10;
        if (skills != null && !skills.trim().isEmpty()) score += 10;
        if (certifications != null && !certifications.trim().isEmpty()) score += 5;
        if (projects != null && !projects.trim().isEmpty()) score += 5;
        this.profileCompletedPercentage = Math.min(100, score);
    }

    public Student() {
    }

    public Student(Long id, User user, String college, String degree, String department, Integer graduationYear, Double cgpa, String location, String skills) {
        this.id = id;
        this.user = user;
        this.college = college;
        this.degree = degree;
        this.department = department;
        this.graduationYear = graduationYear;
        this.cgpa = cgpa;
        this.location = location;
        this.skills = skills;
        calculateProfileCompletion();
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public String getCollege() {
        return college;
    }

    public void setCollege(String college) {
        this.college = college;
    }

    public String getDegree() {
        return degree;
    }

    public void setDegree(String degree) {
        this.degree = degree;
    }

    public String getDepartment() {
        return department;
    }

    public void setDepartment(String department) {
        this.department = department;
    }

    public Integer getGraduationYear() {
        return graduationYear;
    }

    public void setGraduationYear(Integer graduationYear) {
        this.graduationYear = graduationYear;
    }

    public Double getCgpa() {
        return cgpa;
    }

    public void setCgpa(Double cgpa) {
        this.cgpa = cgpa;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public String getSkills() {
        return skills;
    }

    public void setSkills(String skills) {
        this.skills = skills;
    }

    public String getCertifications() {
        return certifications;
    }

    public void setCertifications(String certifications) {
        this.certifications = certifications;
    }

    public String getProjects() {
        return projects;
    }

    public void setProjects(String projects) {
        this.projects = projects;
    }

    public String getResumeUrl() {
        return resumeUrl;
    }

    public void setResumeUrl(String resumeUrl) {
        this.resumeUrl = resumeUrl;
    }

    public Integer getProfileCompletedPercentage() {
        return profileCompletedPercentage;
    }

    public void setProfileCompletedPercentage(Integer profileCompletedPercentage) {
        this.profileCompletedPercentage = profileCompletedPercentage;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
}
