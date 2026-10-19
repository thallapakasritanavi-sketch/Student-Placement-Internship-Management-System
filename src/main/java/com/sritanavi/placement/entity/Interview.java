package com.sritanavi.placement.entity;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "interviews")
public class Interview {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "student_id", nullable = false)
    private Student student;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "application_id")
    private Application application;

    @Column(name = "company_name", nullable = false, length = 150)
    private String companyName;

    @Column(nullable = false, length = 150)
    private String position;

    @Column(name = "interview_date", nullable = false)
    private LocalDate interviewDate;

    @Column(name = "interview_time", length = 50)
    private String interviewTime;

    @Enumerated(EnumType.STRING)
    @Column(name = "interview_mode", nullable = false, length = 20)
    private InterviewMode interviewMode = InterviewMode.ONLINE;

    @Column(name = "meeting_link_or_location", columnDefinition = "TEXT")
    private String meetingLinkOrLocation;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false, length = 30)
    private InterviewStatus status = InterviewStatus.SCHEDULED;

    @Column(columnDefinition = "TEXT")
    private String notes;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        if (createdAt == null) {
            createdAt = LocalDateTime.now();
        }
    }

    public Interview() {
    }

    public Interview(Long id, Student student, Application application, String companyName, String position, LocalDate interviewDate, String interviewTime, InterviewMode interviewMode, String meetingLinkOrLocation, InterviewStatus status, String notes) {
        this.id = id;
        this.student = student;
        this.application = application;
        this.companyName = companyName;
        this.position = position;
        this.interviewDate = interviewDate;
        this.interviewTime = interviewTime;
        this.interviewMode = interviewMode;
        this.meetingLinkOrLocation = meetingLinkOrLocation;
        this.status = status != null ? status : InterviewStatus.SCHEDULED;
        this.notes = notes;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Student getStudent() {
        return student;
    }

    public void setStudent(Student student) {
        this.student = student;
    }

    public Application getApplication() {
        return application;
    }

    public void setApplication(Application application) {
        this.application = application;
    }

    public String getCompanyName() {
        return companyName;
    }

    public void setCompanyName(String companyName) {
        this.companyName = companyName;
    }

    public String getPosition() {
        return position;
    }

    public void setPosition(String position) {
        this.position = position;
    }

    public LocalDate getInterviewDate() {
        return interviewDate;
    }

    public void setInterviewDate(LocalDate interviewDate) {
        this.interviewDate = interviewDate;
    }

    public String getInterviewTime() {
        return interviewTime;
    }

    public void setInterviewTime(String interviewTime) {
        this.interviewTime = interviewTime;
    }

    public InterviewMode getInterviewMode() {
        return interviewMode;
    }

    public void setInterviewMode(InterviewMode interviewMode) {
        this.interviewMode = interviewMode;
    }

    public String getMeetingLinkOrLocation() {
        return meetingLinkOrLocation;
    }

    public void setMeetingLinkOrLocation(String meetingLinkOrLocation) {
        this.meetingLinkOrLocation = meetingLinkOrLocation;
    }

    public InterviewStatus getStatus() {
        return status;
    }

    public void setStatus(InterviewStatus status) {
        this.status = status;
    }

    public String getNotes() {
        return notes;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
