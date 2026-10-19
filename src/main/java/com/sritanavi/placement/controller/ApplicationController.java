package com.sritanavi.placement.controller;

import com.sritanavi.placement.dto.ApiResponse;
import com.sritanavi.placement.dto.ApplicationDto;
import com.sritanavi.placement.dto.ApplicationRequest;
import com.sritanavi.placement.dto.ApplicationStatusRequest;
import com.sritanavi.placement.service.ApplicationService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/applications")
@CrossOrigin(origins = "*")
public class ApplicationController {

    private final ApplicationService applicationService;

    public ApplicationController(ApplicationService applicationService) {
        this.applicationService = applicationService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<ApplicationDto>>> getAllApplications() {
        return ResponseEntity.ok(ApiResponse.ok("Applications fetched", applicationService.getAllApplications()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<ApplicationDto>> getApplicationById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.ok("Application fetched", applicationService.getApplicationById(id)));
    }

    @GetMapping("/student/{studentId}")
    public ResponseEntity<ApiResponse<List<ApplicationDto>>> getApplicationsByStudentId(@PathVariable Long studentId) {
        return ResponseEntity.ok(ApiResponse.ok("Student applications fetched", applicationService.getApplicationsByStudentId(studentId)));
    }

    @GetMapping("/job/{jobId}")
    public ResponseEntity<ApiResponse<List<ApplicationDto>>> getApplicationsByJobId(@PathVariable Long jobId) {
        return ResponseEntity.ok(ApiResponse.ok("Job applications fetched", applicationService.getApplicationsByJobId(jobId)));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<ApplicationDto>> apply(
            @Valid @RequestBody ApplicationRequest request,
            @RequestParam(required = false) Long studentId) {
        ApplicationDto applied = applicationService.apply(request, studentId);
        return new ResponseEntity<>(ApiResponse.ok("Application submitted successfully", applied), HttpStatus.CREATED);
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<ApiResponse<ApplicationDto>> updateStatus(
            @PathVariable Long id,
            @Valid @RequestBody ApplicationStatusRequest request) {
        ApplicationDto updated = applicationService.updateStatus(id, request);
        return ResponseEntity.ok(ApiResponse.ok("Application status updated to " + request.getStatus(), updated));
    }
}
