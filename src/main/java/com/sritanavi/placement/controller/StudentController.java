package com.sritanavi.placement.controller;

import com.sritanavi.placement.dto.ApiResponse;
import com.sritanavi.placement.dto.DashboardStatsDto;
import com.sritanavi.placement.dto.StudentDto;
import com.sritanavi.placement.entity.Student;
import com.sritanavi.placement.entity.User;
import com.sritanavi.placement.exception.ForbiddenException;
import com.sritanavi.placement.repository.StudentRepository;
import com.sritanavi.placement.repository.UserRepository;
import com.sritanavi.placement.service.AdminService;
import com.sritanavi.placement.service.StudentService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/students")
public class StudentController {

    private final StudentService studentService;
    private final AdminService adminService;
    private final UserRepository userRepository;
    private final StudentRepository studentRepository;

    public StudentController(StudentService studentService,
                             AdminService adminService,
                             UserRepository userRepository,
                             StudentRepository studentRepository) {
        this.studentService = studentService;
        this.adminService = adminService;
        this.userRepository = userRepository;
        this.studentRepository = studentRepository;
    }

    private boolean isAdmin(Authentication auth) {
        return auth != null && auth.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));
    }

    private User getAuthenticatedUser(Authentication auth) {
        if (auth == null || !auth.isAuthenticated()) {
            throw new ForbiddenException("Authentication required");
        }
        return userRepository.findByEmail(auth.getName())
                .orElseThrow(() -> new ForbiddenException("Authenticated user not found"));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<StudentDto>>> getAllStudents() {
        return ResponseEntity.ok(ApiResponse.ok("Students fetched", studentService.getAllStudents()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<StudentDto>> getStudentById(
            @PathVariable Long id,
            Authentication auth) {
        if (!isAdmin(auth)) {
            User user = getAuthenticatedUser(auth);
            Student student = studentRepository.findByUser(user)
                    .orElseThrow(() -> new ForbiddenException("Student profile not found"));
            if (!student.getId().equals(id)) {
                throw new ForbiddenException("You can only access your own profile");
            }
        }
        return ResponseEntity.ok(ApiResponse.ok("Student fetched", studentService.getStudentById(id)));
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<ApiResponse<StudentDto>> getStudentByUserId(
            @PathVariable Long userId,
            Authentication auth) {
        if (!isAdmin(auth)) {
            User user = getAuthenticatedUser(auth);
            if (!user.getId().equals(userId)) {
                throw new ForbiddenException("You can only view your own student details");
            }
        }
        return ResponseEntity.ok(ApiResponse.ok("Student profile fetched", studentService.getStudentByUserId(userId)));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<StudentDto>> updateStudent(
            @PathVariable Long id,
            @RequestBody StudentDto dto,
            Authentication auth) {
        if (!isAdmin(auth)) {
            User user = getAuthenticatedUser(auth);
            Student student = studentRepository.findByUser(user)
                    .orElseThrow(() -> new ForbiddenException("Student record not found"));
            if (!student.getId().equals(id)) {
                throw new ForbiddenException("You cannot edit another student's profile");
            }
        }
        return ResponseEntity.ok(ApiResponse.ok("Student profile updated successfully", studentService.updateStudent(id, dto)));
    }

    @GetMapping("/{id}/stats")
    public ResponseEntity<ApiResponse<DashboardStatsDto.StudentStats>> getStudentStats(
            @PathVariable Long id,
            Authentication auth) {
        if (!isAdmin(auth)) {
            User user = getAuthenticatedUser(auth);
            Student student = studentRepository.findByUser(user)
                    .orElseThrow(() -> new ForbiddenException("Student record not found"));
            if (!student.getId().equals(id)) {
                throw new ForbiddenException("You can only view your own stats");
            }
        }
        return ResponseEntity.ok(ApiResponse.ok("Student stats fetched", adminService.getStudentStats(id)));
    }
}
