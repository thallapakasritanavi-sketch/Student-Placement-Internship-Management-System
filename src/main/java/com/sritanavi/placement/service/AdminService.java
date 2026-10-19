package com.sritanavi.placement.service;

import com.sritanavi.placement.dto.DashboardStatsDto;
import com.sritanavi.placement.entity.ApplicationStatus;
import com.sritanavi.placement.entity.Role;
import com.sritanavi.placement.entity.Student;
import com.sritanavi.placement.exception.ResourceNotFoundException;
import com.sritanavi.placement.repository.*;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.Map;

@Service
public class AdminService {

    private final UserRepository userRepository;
    private final StudentRepository studentRepository;
    private final CompanyRepository companyRepository;
    private final JobRepository jobRepository;
    private final InternshipRepository internshipRepository;
    private final ApplicationRepository applicationRepository;
    private final InterviewRepository interviewRepository;
    private final NotificationRepository notificationRepository;

    public AdminService(UserRepository userRepository,
                        StudentRepository studentRepository,
                        CompanyRepository companyRepository,
                        JobRepository jobRepository,
                        InternshipRepository internshipRepository,
                        ApplicationRepository applicationRepository,
                        InterviewRepository interviewRepository,
                        NotificationRepository notificationRepository) {
        this.userRepository = userRepository;
        this.studentRepository = studentRepository;
        this.companyRepository = companyRepository;
        this.jobRepository = jobRepository;
        this.internshipRepository = internshipRepository;
        this.applicationRepository = applicationRepository;
        this.interviewRepository = interviewRepository;
        this.notificationRepository = notificationRepository;
    }

    public DashboardStatsDto.AdminStats getAdminStats() {
        DashboardStatsDto.AdminStats stats = new DashboardStatsDto.AdminStats();
        stats.setTotalStudents(studentRepository.count());
        stats.setTotalCompanies(companyRepository.count());
        stats.setTotalJobs(jobRepository.count());
        stats.setTotalInternships(internshipRepository.count());
        stats.setTotalApplications(applicationRepository.count());
        stats.setSelectedStudents(applicationRepository.countByStatus(ApplicationStatus.SELECTED));
        stats.setUpcomingInterviews(interviewRepository.findByInterviewDateGreaterThanEqualOrderByInterviewDateAsc(LocalDate.now()).size());

        Map<String, Long> statusMap = new HashMap<>();
        for (ApplicationStatus s : ApplicationStatus.values()) {
            statusMap.put(s.name(), applicationRepository.countByStatus(s));
        }
        stats.setApplicationsByStatus(statusMap);

        return stats;
    }

    public DashboardStatsDto.StudentStats getStudentStats(Long studentId) {
        Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found with id: " + studentId));

        DashboardStatsDto.StudentStats stats = new DashboardStatsDto.StudentStats();
        stats.setStudentName(student.getUser() != null ? student.getUser().getFullName() : "Student");
        stats.setProfileCompletion(student.getProfileCompletedPercentage() != null ? student.getProfileCompletedPercentage() : 50);
        stats.setAvailableJobs(jobRepository.findByStatusOrderByCreatedAtDesc("ACTIVE").size());
        stats.setAvailableInternships(internshipRepository.findByStatusOrderByCreatedAtDesc("ACTIVE").size());
        stats.setTotalApplications(applicationRepository.countByStudent(student));
        stats.setShortlistedApplications(applicationRepository.countByStudentAndStatus(student, ApplicationStatus.SHORTLISTED));
        stats.setSelectedApplications(applicationRepository.countByStudentAndStatus(student, ApplicationStatus.SELECTED));
        stats.setUpcomingInterviews(interviewRepository.findByStudentOrderByInterviewDateAsc(student).size());

        if (student.getUser() != null) {
            stats.setUnreadNotifications(notificationRepository.countByUserIdAndIsReadFalse(student.getUser().getId()));
        }

        return stats;
    }
}
