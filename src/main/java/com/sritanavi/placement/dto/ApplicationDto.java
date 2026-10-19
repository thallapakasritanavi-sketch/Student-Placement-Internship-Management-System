package com.sritanavi.placement.dto;

import com.sritanavi.placement.entity.ApplicationStatus;
import java.time.LocalDateTime;

public class ApplicationDto {
    private Long id;
    private Long studentId;
    private String studentName;
    private String studentEmail;
    private String studentDepartment;
    private Double studentCgpa;
    private String studentSkills;
    private Long jobId;
    private String jobTitle;
    private Long internshipId;
    private String internshipTitle;
    private String companyName;
    private String positionTitle;
    private String applicationType; // JOB or INTERNSHIP
    private ApplicationStatus status;
    private LocalDateTime appliedDate;
    private String notes;

    public ApplicationDto() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getStudentId() { return studentId; }
    public void setStudentId(Long studentId) { this.studentId = studentId; }

    public String getStudentName() { return studentName; }
    public void setStudentName(String studentName) { this.studentName = studentName; }

    public String getStudentEmail() { return studentEmail; }
    public void setStudentEmail(String studentEmail) { this.studentEmail = studentEmail; }

    public String getStudentDepartment() { return studentDepartment; }
    public void setStudentDepartment(String studentDepartment) { this.studentDepartment = studentDepartment; }

    public Double getStudentCgpa() { return studentCgpa; }
    public void setStudentCgpa(Double studentCgpa) { this.studentCgpa = studentCgpa; }

    public String getStudentSkills() { return studentSkills; }
    public void setStudentSkills(String studentSkills) { this.studentSkills = studentSkills; }

    public Long getJobId() { return jobId; }
    public void setJobId(Long jobId) { this.jobId = jobId; }

    public String getJobTitle() { return jobTitle; }
    public void setJobTitle(String jobTitle) { this.jobTitle = jobTitle; }

    public Long getInternshipId() { return internshipId; }
    public void setInternshipId(Long internshipId) { this.internshipId = internshipId; }

    public String getInternshipTitle() { return internshipTitle; }
    public void setInternshipTitle(String internshipTitle) { this.internshipTitle = internshipTitle; }

    public String getCompanyName() { return companyName; }
    public void setCompanyName(String companyName) { this.companyName = companyName; }

    public String getPositionTitle() { return positionTitle; }
    public void setPositionTitle(String positionTitle) { this.positionTitle = positionTitle; }

    public String getApplicationType() { return applicationType; }
    public void setApplicationType(String applicationType) { this.applicationType = applicationType; }

    public ApplicationStatus getStatus() { return status; }
    public void setStatus(ApplicationStatus status) { this.status = status; }

    public LocalDateTime getAppliedDate() { return appliedDate; }
    public void setAppliedDate(LocalDateTime appliedDate) { this.appliedDate = appliedDate; }

    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }
}
