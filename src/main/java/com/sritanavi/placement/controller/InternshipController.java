package com.sritanavi.placement.controller;

import com.sritanavi.placement.dto.ApiResponse;
import com.sritanavi.placement.dto.InternshipDto;
import com.sritanavi.placement.service.InternshipService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/internships")
@CrossOrigin(origins = "*")
public class InternshipController {

    private final InternshipService internshipService;

    public InternshipController(InternshipService internshipService) {
        this.internshipService = internshipService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<InternshipDto>>> getAllInternships(
            @RequestParam(required = false) Long studentId) {
        return ResponseEntity.ok(ApiResponse.ok("Internships fetched successfully", internshipService.getAllInternships(studentId)));
    }

    @GetMapping("/search")
    public ResponseEntity<ApiResponse<List<InternshipDto>>> searchInternships(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) String location,
            @RequestParam(required = false) Long studentId) {
        return ResponseEntity.ok(ApiResponse.ok("Internships filtered successfully", internshipService.searchInternships(keyword, location, studentId)));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<InternshipDto>> getInternshipById(
            @PathVariable Long id,
            @RequestParam(required = false) Long studentId) {
        return ResponseEntity.ok(ApiResponse.ok("Internship fetched successfully", internshipService.getInternshipById(id, studentId)));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<InternshipDto>> createInternship(@Valid @RequestBody InternshipDto dto) {
        InternshipDto created = internshipService.createInternship(dto);
        return new ResponseEntity<>(ApiResponse.ok("Internship posted successfully", created), HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<InternshipDto>> updateInternship(@PathVariable Long id, @RequestBody InternshipDto dto) {
        InternshipDto updated = internshipService.updateInternship(id, dto);
        return ResponseEntity.ok(ApiResponse.ok("Internship updated successfully", updated));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteInternship(@PathVariable Long id) {
        internshipService.deleteInternship(id);
        return ResponseEntity.ok(ApiResponse.ok("Internship deleted successfully"));
    }
}
