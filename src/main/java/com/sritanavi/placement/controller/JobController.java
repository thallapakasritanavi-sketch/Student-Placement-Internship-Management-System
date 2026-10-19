package com.sritanavi.placement.controller;

import com.sritanavi.placement.dto.ApiResponse;
import com.sritanavi.placement.dto.JobDto;
import com.sritanavi.placement.service.JobService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/jobs")
@CrossOrigin(origins = "*")
public class JobController {

    private final JobService jobService;

    public JobController(JobService jobService) {
        this.jobService = jobService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<JobDto>>> getAllJobs(
            @RequestParam(required = false) Long studentId) {
        return ResponseEntity.ok(ApiResponse.ok("Jobs fetched successfully", jobService.getAllJobs(studentId)));
    }

    @GetMapping("/search")
    public ResponseEntity<ApiResponse<List<JobDto>>> searchJobs(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) String location,
            @RequestParam(required = false) String jobType,
            @RequestParam(required = false) Long studentId) {
        return ResponseEntity.ok(ApiResponse.ok("Jobs filtered successfully", jobService.searchJobs(keyword, location, jobType, studentId)));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<JobDto>> getJobById(
            @PathVariable Long id,
            @RequestParam(required = false) Long studentId) {
        return ResponseEntity.ok(ApiResponse.ok("Job fetched successfully", jobService.getJobById(id, studentId)));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<JobDto>> createJob(@Valid @RequestBody JobDto dto) {
        JobDto created = jobService.createJob(dto);
        return new ResponseEntity<>(ApiResponse.ok("Job posted successfully", created), HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<JobDto>> updateJob(@PathVariable Long id, @RequestBody JobDto dto) {
        JobDto updated = jobService.updateJob(id, dto);
        return ResponseEntity.ok(ApiResponse.ok("Job updated successfully", updated));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteJob(@PathVariable Long id) {
        jobService.deleteJob(id);
        return ResponseEntity.ok(ApiResponse.ok("Job deleted successfully"));
    }
}
