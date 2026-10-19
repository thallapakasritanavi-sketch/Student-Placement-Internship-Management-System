package com.sritanavi.placement.service;

import com.sritanavi.placement.dto.AuthDto;
import com.sritanavi.placement.entity.Company;
import com.sritanavi.placement.entity.Role;
import com.sritanavi.placement.entity.Student;
import com.sritanavi.placement.entity.User;
import com.sritanavi.placement.exception.BadRequestException;
import com.sritanavi.placement.repository.CompanyRepository;
import com.sritanavi.placement.repository.StudentRepository;
import com.sritanavi.placement.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final StudentRepository studentRepository;
    private final CompanyRepository companyRepository;
    private final PasswordEncoder passwordEncoder;
    private final NotificationService notificationService;

    public AuthService(UserRepository userRepository,
                       StudentRepository studentRepository,
                       CompanyRepository companyRepository,
                       PasswordEncoder passwordEncoder,
                       NotificationService notificationService) {
        this.userRepository = userRepository;
        this.studentRepository = studentRepository;
        this.companyRepository = companyRepository;
        this.passwordEncoder = passwordEncoder;
        this.notificationService = notificationService;
    }

    public AuthDto.AuthResponse login(AuthDto.LoginRequest request) {
        User user = userRepository.findByEmail(request.getEmail().trim().toLowerCase())
                .orElseThrow(() -> new BadRequestException("Invalid email or password"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new BadRequestException("Invalid email or password");
        }

        Long studentId = null;
        if (user.getRole() == Role.STUDENT) {
            Optional<Student> student = studentRepository.findByUser(user);
            if (student.isPresent()) {
                studentId = student.get().getId();
            }
        }

        String redirectUrl = "/student/dashboard";
        if (user.getRole() == Role.ADMIN) {
            redirectUrl = "/admin/dashboard";
        } else if (user.getRole() == Role.RECRUITER) {
            redirectUrl = "/recruiter/dashboard";
        }

        return new AuthDto.AuthResponse(
                user.getId(),
                studentId,
                user.getFullName(),
                user.getEmail(),
                user.getRole().name(),
                redirectUrl
        );
    }

    @Transactional
    public AuthDto.AuthResponse register(AuthDto.RegisterRequest request) {
        String email = request.getEmail().trim().toLowerCase();
        if (userRepository.existsByEmail(email)) {
            throw new BadRequestException("User with email " + email + " already exists");
        }

        User user = new User();
        user.setEmail(email);
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setFullName(request.getFullName().trim());
        user.setPhone(request.getPhone());
        user.setRole(request.getRole() != null ? request.getRole() : Role.STUDENT);

        User savedUser = userRepository.save(user);
        Long studentId = null;

        if (savedUser.getRole() == Role.STUDENT) {
            Student student = new Student();
            student.setUser(savedUser);
            student.setCollege(request.getCollege());
            student.setDegree(request.getDegree());
            student.setDepartment(request.getDepartment());
            student.setGraduationYear(request.getGraduationYear());
            student.setCgpa(request.getCgpa());
            student.setLocation(request.getLocation());
            student.setSkills(request.getSkills());
            student.calculateProfileCompletion();

            Student savedStudent = studentRepository.save(student);
            studentId = savedStudent.getId();

            notificationService.createNotification(
                    savedUser,
                    "Welcome to Placement Portal!",
                    "Welcome " + savedUser.getFullName() + "! Complete your profile to apply for top jobs and internships.",
                    "INFO"
            );
        } else if (savedUser.getRole() == Role.RECRUITER) {
            if (request.getCompanyName() != null && !request.getCompanyName().trim().isEmpty()) {
                Company company = new Company();
                company.setName(request.getCompanyName().trim());
                company.setDescription(request.getCompanyDescription());
                company.setWebsite(request.getCompanyWebsite());
                company.setContactEmail(savedUser.getEmail());
                company.setContactPhone(savedUser.getPhone());
                companyRepository.save(company);
            }
        }

        String redirectUrl = savedUser.getRole() == Role.ADMIN ? "/admin/dashboard" :
                (savedUser.getRole() == Role.RECRUITER ? "/recruiter/dashboard" : "/student/dashboard");

        return new AuthDto.AuthResponse(
                savedUser.getId(),
                studentId,
                savedUser.getFullName(),
                savedUser.getEmail(),
                savedUser.getRole().name(),
                redirectUrl
        );
    }
}
