package com.sritanavi.placement.dto;

import com.sritanavi.placement.entity.Role;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class AuthDto {

    public static class LoginRequest {
        @NotBlank(message = "Email is required")
        @Email(message = "Invalid email format")
        private String email;

        @NotBlank(message = "Password is required")
        private String password;

        public LoginRequest() {}

        public LoginRequest(String email, String password) {
            this.email = email;
            this.password = password;
        }

        public String getEmail() { return email; }
        public void setEmail(String email) { this.email = email; }

        public String getPassword() { return password; }
        public void setPassword(String password) { this.password = password; }
    }

    public static class RegisterRequest {
        @NotBlank(message = "Full name is required")
        private String fullName;

        @NotBlank(message = "Email is required")
        @Email(message = "Invalid email format")
        private String email;

        @NotBlank(message = "Password is required")
        @Size(min = 6, message = "Password must be at least 6 characters")
        private String password;

        private String phone;
        private Role role = Role.STUDENT;

        // Student-specific fields
        private String college;
        private String degree;
        private String department;
        private Integer graduationYear;
        private Double cgpa;
        private String location;
        private String skills;

        // Recruiter-specific fields
        private String companyName;
        private String companyDescription;
        private String companyWebsite;

        public RegisterRequest() {}

        public String getFullName() { return fullName; }
        public void setFullName(String fullName) { this.fullName = fullName; }

        public String getEmail() { return email; }
        public void setEmail(String email) { this.email = email; }

        public String getPassword() { return password; }
        public void setPassword(String password) { this.password = password; }

        public String getPhone() { return phone; }
        public void setPhone(String phone) { this.phone = phone; }

        public Role getRole() { return role; }
        public void setRole(Role role) { this.role = role; }

        public String getCollege() { return college; }
        public void setCollege(String college) { this.college = college; }

        public String getDegree() { return degree; }
        public void setDegree(String degree) { this.degree = degree; }

        public String getDepartment() { return department; }
        public void setDepartment(String department) { this.department = department; }

        public Integer getGraduationYear() { return graduationYear; }
        public void setGraduationYear(Integer graduationYear) { this.graduationYear = graduationYear; }

        public Double getCgpa() { return cgpa; }
        public void setCgpa(Double cgpa) { this.cgpa = cgpa; }

        public String getLocation() { return location; }
        public void setLocation(String location) { this.location = location; }

        public String getSkills() { return skills; }
        public void setSkills(String skills) { this.skills = skills; }

        public String getCompanyName() { return companyName; }
        public void setCompanyName(String companyName) { this.companyName = companyName; }

        public String getCompanyDescription() { return companyDescription; }
        public void setCompanyDescription(String companyDescription) { this.companyDescription = companyDescription; }

        public String getCompanyWebsite() { return companyWebsite; }
        public void setCompanyWebsite(String companyWebsite) { this.companyWebsite = companyWebsite; }
    }

    public static class AuthResponse {
        private Long userId;
        private Long studentId;
        private String fullName;
        private String email;
        private String role;
        private String redirectUrl;

        public AuthResponse() {}

        public AuthResponse(Long userId, Long studentId, String fullName, String email, String role, String redirectUrl) {
            this.userId = userId;
            this.studentId = studentId;
            this.fullName = fullName;
            this.email = email;
            this.role = role;
            this.redirectUrl = redirectUrl;
        }

        public Long getUserId() { return userId; }
        public void setUserId(Long userId) { this.userId = userId; }

        public Long getStudentId() { return studentId; }
        public void setStudentId(Long studentId) { this.studentId = studentId; }

        public String getFullName() { return fullName; }
        public void setFullName(String fullName) { this.fullName = fullName; }

        public String getEmail() { return email; }
        public void setEmail(String email) { this.email = email; }

        public String getRole() { return role; }
        public void setRole(String role) { this.role = role; }

        public String getRedirectUrl() { return redirectUrl; }
        public void setRedirectUrl(String redirectUrl) { this.redirectUrl = redirectUrl; }
    }
}
