package com.sritanavi.placement.controller;

import com.sritanavi.placement.dto.ApiResponse;
import com.sritanavi.placement.dto.DashboardStatsDto;
import com.sritanavi.placement.dto.StudentDto;
import com.sritanavi.placement.service.AdminService;
import com.sritanavi.placement.service.StudentService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/students")
@CrossOrigin(origins = "*")
public class StudentController {

    private final StudentService studentService;
    private final AdminService adminService;

    public StudentController(StudentService studentService, AdminService adminService) {
        this.studentService = studentService;
        this.adminService = adminService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<StudentDto>>> getAllStudents() {
        return ResponseEntity.ok(ApiResponse.ok("Students fetched", studentService.getAllStudents()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<StudentDto>> getStudentById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.ok("Student fetched", studentService.getStudentById(id)));
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<ApiResponse<StudentDto>> getStudentByUserId(@PathVariable Long userId) {
        return ResponseEntity.ok(ApiResponse.ok("Student profile fetched", studentService.getStudentByUserId(userId)));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<StudentDto>> updateStudent(@PathVariable Long id, @RequestBody StudentDto dto) {
        return ResponseEntity.ok(ApiResponse.ok("Student profile updated successfully", studentService.updateStudent(id, dto)));
    }

    @GetMapping("/{id}/stats")
    public ResponseEntity<ApiResponse<DashboardStatsDto.StudentStats>> getStudentStats(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.ok("Student stats fetched", adminService.getStudentStats(id)));
    }
}
