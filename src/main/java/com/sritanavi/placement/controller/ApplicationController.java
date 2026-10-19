package com.sritanavi.placement.controller;

import com.sritanavi.placement.dto.ApiResponse;
import com.sritanavi.placement.dto.ApplicationDto;
import com.sritanavi.placement.dto.ApplicationRequest;
import com.sritanavi.placement.dto.ApplicationStatusRequest;
import com.sritanavi.placement.entity.Student;
import com.sritanavi.placement.entity.User;
import com.sritanavi.placement.exception.ForbiddenException;
import com.sritanavi.placement.exception.ResourceNotFoundException;
import com.sritanavi.placement.repository.StudentRepository;
import com.sritanavi.placement.repository.UserRepository;
import com.sritanavi.placement.service.ApplicationService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/applications")
public class ApplicationController {

    private final ApplicationService applicationService;
    private final UserRepository userRepository;
    private final StudentRepository studentRepository;

    public ApplicationController(ApplicationService applicationService,
                                 UserRepository userRepository,
                                 StudentRepository studentRepository) {
        this.applicationService = applicationService;
        this.userRepository = userRepository;
        this.studentRepository = studentRepository;
    }

    private User getAuthenticatedUser(Authentication auth) {
        if (auth == null || !auth.isAuthenticated()) {
            throw new ForbiddenException("Authentication required");
        }
        return userRepository.findByEmail(auth.getName())
                .orElseThrow(() -> new ForbiddenException("Authenticated user not found"));
    }

    private boolean isAdmin(Authentication auth) {
        return auth != null && auth.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<ApplicationDto>>> getAllApplications() {
        return ResponseEntity.ok(ApiResponse.ok("Applications fetched", applicationService.getAllApplications()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<ApplicationDto>> getApplicationById(
            @PathVariable Long id,
            Authentication auth) {
        ApplicationDto dto = applicationService.getApplicationById(id);
        if (!isAdmin(auth)) {
            User user = getAuthenticatedUser(auth);
            Student student = studentRepository.findByUser(user)
                    .orElseThrow(() -> new ForbiddenException("Only students can access their applications"));
            if (!dto.getStudentId().equals(student.getId())) {
                throw new ForbiddenException("You can only view your own applications");
            }
        }
        return ResponseEntity.ok(ApiResponse.ok("Application fetched", dto));
    }

    @GetMapping("/student/{studentId}")
    public ResponseEntity<ApiResponse<List<ApplicationDto>>> getApplicationsByStudentId(
            @PathVariable Long studentId,
            Authentication auth) {
        if (!isAdmin(auth)) {
            User user = getAuthenticatedUser(auth);
            Student student = studentRepository.findByUser(user)
                    .orElseThrow(() -> new ForbiddenException("Only students can access their applications"));
            if (!student.getId().equals(studentId)) {
                throw new ForbiddenException("You cannot view applications belonging to other students");
            }
        }
        return ResponseEntity.ok(ApiResponse.ok("Student applications fetched", applicationService.getApplicationsByStudentId(studentId)));
    }

    @GetMapping("/job/{jobId}")
    public ResponseEntity<ApiResponse<List<ApplicationDto>>> getApplicationsByJobId(@PathVariable Long jobId) {
        return ResponseEntity.ok(ApiResponse.ok("Job applications fetched", applicationService.getApplicationsByJobId(jobId)));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<ApplicationDto>> apply(
            @Valid @RequestBody ApplicationRequest request,
            @RequestParam(required = false) Long studentId,
            Authentication auth) {

        Long verifiedStudentId;
        if (isAdmin(auth)) {
            verifiedStudentId = request.getStudentId() != null ? request.getStudentId() : studentId;
        } else {
            User user = getAuthenticatedUser(auth);
            Student student = studentRepository.findByUser(user)
                    .orElseThrow(() -> new ForbiddenException("Only registered students can submit applications"));
            verifiedStudentId = student.getId();
        }

        request.setStudentId(verifiedStudentId);
        ApplicationDto applied = applicationService.apply(request, verifiedStudentId);
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
