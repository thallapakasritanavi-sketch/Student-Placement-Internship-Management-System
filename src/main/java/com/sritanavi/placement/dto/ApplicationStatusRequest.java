package com.sritanavi.placement.dto;

import com.sritanavi.placement.entity.ApplicationStatus;
import jakarta.validation.constraints.NotNull;

public class ApplicationStatusRequest {

    @NotNull(message = "Status cannot be null")
    private ApplicationStatus status;

    private String notes;

    public ApplicationStatusRequest() {}

    public ApplicationStatusRequest(ApplicationStatus status, String notes) {
        this.status = status;
        this.notes = notes;
    }

    public ApplicationStatus getStatus() { return status; }
    public void setStatus(ApplicationStatus status) { this.status = status; }

    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }
}
