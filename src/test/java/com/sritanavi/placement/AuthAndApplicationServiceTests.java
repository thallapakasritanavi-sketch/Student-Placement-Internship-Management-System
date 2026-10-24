package com.sritanavi.placement;

import com.sritanavi.placement.dto.ApplicationDto;
import com.sritanavi.placement.dto.ApplicationRequest;
import com.sritanavi.placement.dto.ApplicationStatusRequest;
import com.sritanavi.placement.dto.AuthDto;
import com.sritanavi.placement.dto.JobDto;
import com.sritanavi.placement.entity.ApplicationStatus;
import com.sritanavi.placement.entity.Role;
import com.sritanavi.placement.exception.BadRequestException;
import com.sritanavi.placement.service.ApplicationService;
import com.sritanavi.placement.service.AuthService;
import com.sritanavi.placement.service.JobService;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;

@SpringBootTest
@ActiveProfiles("h2")
@Transactional
public class AuthAndApplicationServiceTests {

    @Autowired
    private AuthService authService;

    @Autowired
    private JobService jobService;

    @Autowired
    private ApplicationService applicationService;

    @Test
    void testStudentRegistrationAndLogin() {
        AuthDto.RegisterRequest registerReq = new AuthDto.RegisterRequest();
        registerReq.setFullName("Test Student");
        registerReq.setEmail("test.student@example.com");
        registerReq.setPassword("password123");
        registerReq.setPhone("1234567890");
        registerReq.setRole(Role.STUDENT);
        registerReq.setCollege("NIT");
        registerReq.setDepartment("CSE");
        registerReq.setCgpa(8.5);

        AuthDto.AuthResponse authRes = authService.register(registerReq);
        Assertions.assertNotNull(authRes.getUserId());
        Assertions.assertNotNull(authRes.getStudentId());
        Assertions.assertEquals("STUDENT", authRes.getRole());

        // Login Test
        AuthDto.LoginRequest loginReq = new AuthDto.LoginRequest("test.student@example.com", "password123");
        AuthDto.AuthResponse loginRes = authService.login(loginReq);
        Assertions.assertEquals("Test Student", loginRes.getFullName());
    }

    @Test
    void testAdminLoginReturnsSriTanaviProfile() {
        AuthDto.LoginRequest loginReq = new AuthDto.LoginRequest("sri", "admin123");
        AuthDto.AuthResponse loginRes = authService.login(loginReq);
        Assertions.assertEquals("Sri Tanavi", loginRes.getFullName());
        Assertions.assertEquals("ADMIN", loginRes.getRole());
        Assertions.assertEquals("/admin/dashboard", loginRes.getRedirectUrl());
    }

    @Test
    void testJobCreationAndDuplicateApplicationPrevention() {
        // Create Job
        JobDto jobDto = new JobDto();
        jobDto.setTitle("Backend Engineer");
        jobDto.setCompany("Alpha Systems");
        jobDto.setLocation("Bangalore");
        jobDto.setSalary("10 LPA");
        jobDto.setMinCgpa(7.0);
        jobDto.setRequiredSkills("Java, Spring");
        jobDto.setDeadline(LocalDate.now().plusDays(10));
        JobDto savedJob = jobService.createJob(jobDto);

        Assertions.assertNotNull(savedJob.getId());

        // Register Student
        AuthDto.RegisterRequest registerReq = new AuthDto.RegisterRequest();
        registerReq.setFullName("App Tester");
        registerReq.setEmail("app.tester@example.com");
        registerReq.setPassword("secret123");
        registerReq.setRole(Role.STUDENT);
        AuthDto.AuthResponse studentAuth = authService.register(registerReq);

        // First application should succeed
        ApplicationRequest appReq = new ApplicationRequest();
        appReq.setStudentId(studentAuth.getStudentId());
        appReq.setJobId(savedJob.getId());
        appReq.setNotes("Excited to join!");
        ApplicationDto appDto = applicationService.apply(appReq, studentAuth.getStudentId());

        Assertions.assertNotNull(appDto.getId());
        Assertions.assertEquals(ApplicationStatus.APPLIED, appDto.getStatus());

        // Duplicate application must throw BadRequestException
        Assertions.assertThrows(BadRequestException.class, () -> {
            applicationService.apply(appReq, studentAuth.getStudentId());
        });

        // Status update
        ApplicationStatusRequest statusReq = new ApplicationStatusRequest(ApplicationStatus.SHORTLISTED, "Shortlisted based on test score");
        ApplicationDto updated = applicationService.updateStatus(appDto.getId(), statusReq);
        Assertions.assertEquals(ApplicationStatus.SHORTLISTED, updated.getStatus());
    }
}
