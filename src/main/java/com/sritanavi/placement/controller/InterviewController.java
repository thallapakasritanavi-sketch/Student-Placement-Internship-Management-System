package com.sritanavi.placement.controller;

import com.sritanavi.placement.dto.ApiResponse;
import com.sritanavi.placement.dto.InterviewDto;
import com.sritanavi.placement.service.InterviewService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/interviews")
public class InterviewController {

    private final InterviewService interviewService;

    public InterviewController(InterviewService interviewService) {
        this.interviewService = interviewService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<InterviewDto>>> getAllInterviews() {
        return ResponseEntity.ok(ApiResponse.ok("Interviews fetched", interviewService.getAllInterviews()));
    }

    @GetMapping("/student/{studentId}")
    public ResponseEntity<ApiResponse<List<InterviewDto>>> getInterviewsByStudentId(@PathVariable Long studentId) {
        return ResponseEntity.ok(ApiResponse.ok("Student interviews fetched", interviewService.getInterviewsByStudentId(studentId)));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<InterviewDto>> scheduleInterview(@Valid @RequestBody InterviewDto dto) {
        InterviewDto scheduled = interviewService.scheduleInterview(dto);
        return new ResponseEntity<>(ApiResponse.ok("Interview scheduled successfully", scheduled), HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<InterviewDto>> updateInterview(@PathVariable Long id, @RequestBody InterviewDto dto) {
        InterviewDto updated = interviewService.updateInterview(id, dto);
        return ResponseEntity.ok(ApiResponse.ok("Interview updated successfully", updated));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteInterview(@PathVariable Long id) {
        interviewService.deleteInterview(id);
        return ResponseEntity.ok(ApiResponse.ok("Interview deleted successfully"));
    }
}
