package com.sritanavi.placement.dto;

import com.sritanavi.placement.entity.InterviewMode;
import com.sritanavi.placement.entity.InterviewStatus;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;
import java.time.LocalDateTime;

public class InterviewDto {
    private Long id;

    @NotNull(message = "Student ID is required")
    private Long studentId;
    private String studentName;
    private String studentEmail;

    private Long applicationId;

    @NotBlank(message = "Company name is required")
    private String companyName;

    @NotBlank(message = "Position is required")
    private String position;

    @NotNull(message = "Interview date is required")
    private LocalDate interviewDate;

    private String interviewTime;
    private InterviewMode interviewMode = InterviewMode.ONLINE;
    private String meetingLinkOrLocation;
    private InterviewStatus status = InterviewStatus.SCHEDULED;
    private String notes;
    private LocalDateTime createdAt;

    public InterviewDto() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getStudentId() { return studentId; }
    public void setStudentId(Long studentId) { this.studentId = studentId; }

    public String getStudentName() { return studentName; }
    public void setStudentName(String studentName) { this.studentName = studentName; }

    public String getStudentEmail() { return studentEmail; }
    public void setStudentEmail(String studentEmail) { this.studentEmail = studentEmail; }

    public Long getApplicationId() { return applicationId; }
    public void setApplicationId(Long applicationId) { this.applicationId = applicationId; }

    public String getCompanyName() { return companyName; }
    public void setCompanyName(String companyName) { this.companyName = companyName; }

    public String getPosition() { return position; }
    public void setPosition(String position) { this.position = position; }

    public LocalDate getInterviewDate() { return interviewDate; }
    public void setInterviewDate(LocalDate interviewDate) { this.interviewDate = interviewDate; }

    public String getInterviewTime() { return interviewTime; }
    public void setInterviewTime(String interviewTime) { this.interviewTime = interviewTime; }

    public InterviewMode getInterviewMode() { return interviewMode; }
    public void setInterviewMode(InterviewMode interviewMode) { this.interviewMode = interviewMode; }

    public String getMeetingLinkOrLocation() { return meetingLinkOrLocation; }
    public void setMeetingLinkOrLocation(String meetingLinkOrLocation) { this.meetingLinkOrLocation = meetingLinkOrLocation; }

    public InterviewStatus getStatus() { return status; }
    public void setStatus(InterviewStatus status) { this.status = status; }

    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
