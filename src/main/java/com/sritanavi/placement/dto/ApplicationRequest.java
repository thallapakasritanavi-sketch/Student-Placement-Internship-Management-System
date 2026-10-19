package com.sritanavi.placement.dto;

import jakarta.validation.constraints.NotNull;

public class ApplicationRequest {

    private Long studentId; // Optional if derived from authenticated user
    private Long jobId;
    private Long internshipId;
    private String notes;

    public ApplicationRequest() {}

    public Long getStudentId() { return studentId; }
    public void setStudentId(Long studentId) { this.studentId = studentId; }

    public Long getJobId() { return jobId; }
    public void setJobId(Long jobId) { this.jobId = jobId; }

    public Long getInternshipId() { return internshipId; }
    public void setInternshipId(Long internshipId) { this.internshipId = internshipId; }

    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }
}
