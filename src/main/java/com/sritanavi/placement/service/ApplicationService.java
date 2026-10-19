package com.sritanavi.placement.service;

import com.sritanavi.placement.dto.ApplicationDto;
import com.sritanavi.placement.dto.ApplicationRequest;
import com.sritanavi.placement.dto.ApplicationStatusRequest;
import com.sritanavi.placement.entity.*;
import com.sritanavi.placement.exception.BadRequestException;
import com.sritanavi.placement.exception.ResourceNotFoundException;
import com.sritanavi.placement.repository.ApplicationRepository;
import com.sritanavi.placement.repository.InternshipRepository;
import com.sritanavi.placement.repository.JobRepository;
import com.sritanavi.placement.repository.StudentRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ApplicationService {

    private final ApplicationRepository applicationRepository;
    private final StudentRepository studentRepository;
    private final JobRepository jobRepository;
    private final InternshipRepository internshipRepository;
    private final NotificationService notificationService;

    public ApplicationService(ApplicationRepository applicationRepository,
                              StudentRepository studentRepository,
                              JobRepository jobRepository,
                              InternshipRepository internshipRepository,
                              NotificationService notificationService) {
        this.applicationRepository = applicationRepository;
        this.studentRepository = studentRepository;
        this.jobRepository = jobRepository;
        this.internshipRepository = internshipRepository;
        this.notificationService = notificationService;
    }

    @Transactional
    public ApplicationDto apply(ApplicationRequest request, Long authenticatedStudentId) {
        Long studentId = request.getStudentId() != null ? request.getStudentId() : authenticatedStudentId;
        if (studentId == null) {
            throw new BadRequestException("Student ID is required to apply");
        }

        Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found with id: " + studentId));

        if (request.getJobId() == null && request.getInternshipId() == null) {
            throw new BadRequestException("Either jobId or internshipId must be provided");
        }

        Application application = new Application();
        application.setStudent(student);
        application.setNotes(request.getNotes());
        application.setStatus(ApplicationStatus.APPLIED);

        String positionTitle = "";
        String companyName = "";

        if (request.getJobId() != null) {
            Job job = jobRepository.findById(request.getJobId())
                    .orElseThrow(() -> new ResourceNotFoundException("Job not found with id: " + request.getJobId()));

            // Check duplicate application
            if (applicationRepository.existsByStudentAndJob(student, job)) {
                throw new BadRequestException("You have already applied for this job (" + job.getTitle() + " at " + job.getCompany() + ")");
            }

            application.setJob(job);
            application.setApplicationType("JOB");
            positionTitle = job.getTitle();
            companyName = job.getCompany();
        } else {
            Internship internship = internshipRepository.findById(request.getInternshipId())
                    .orElseThrow(() -> new ResourceNotFoundException("Internship not found with id: " + request.getInternshipId()));

            // Check duplicate application
            if (applicationRepository.existsByStudentAndInternship(student, internship)) {
                throw new BadRequestException("You have already applied for this internship (" + internship.getTitle() + " at " + internship.getCompany() + ")");
            }

            application.setInternship(internship);
            application.setApplicationType("INTERNSHIP");
            positionTitle = internship.getTitle();
            companyName = internship.getCompany();
        }

        Application saved = applicationRepository.save(application);

        // Send confirmation notification
        if (student.getUser() != null) {
            notificationService.createNotification(
                    student.getUser(),
                    "Application Submitted",
                    "Your application for " + positionTitle + " at " + companyName + " has been successfully submitted.",
                    "APPLICATION"
            );
        }

        return mapToDto(saved);
    }

    @Transactional
    public ApplicationDto updateStatus(Long applicationId, ApplicationStatusRequest request) {
        Application application = applicationRepository.findById(applicationId)
                .orElseThrow(() -> new ResourceNotFoundException("Application not found with id: " + applicationId));

        application.setStatus(request.getStatus());
        if (request.getNotes() != null) {
            application.setNotes(request.getNotes());
        }

        Application updated = applicationRepository.save(application);

        // Notify student of status update
        if (application.getStudent() != null && application.getStudent().getUser() != null) {
            String position = application.getJob() != null ? application.getJob().getTitle() :
                    (application.getInternship() != null ? application.getInternship().getTitle() : "Position");
            String company = application.getJob() != null ? application.getJob().getCompany() :
                    (application.getInternship() != null ? application.getInternship().getCompany() : "Company");

            String statusMessage = "Your application for " + position + " at " + company + " status changed to: " + request.getStatus().name();
            if (request.getStatus() == ApplicationStatus.SHORTLISTED) {
                statusMessage = "Congratulations! Your application for " + position + " at " + company + " has been SHORTLISTED.";
            } else if (request.getStatus() == ApplicationStatus.SELECTED) {
                statusMessage = "🎉 Congratulations! You have been SELECTED for " + position + " at " + company + "!";
            } else if (request.getStatus() == ApplicationStatus.INTERVIEW_SCHEDULED) {
                statusMessage = "An interview has been scheduled for your application at " + company + ". Check your interview schedule.";
            }

            notificationService.createNotification(
                    application.getStudent().getUser(),
                    "Application Status Update",
                    statusMessage,
                    "APPLICATION"
            );
        }

        return mapToDto(updated);
    }

    public List<ApplicationDto> getAllApplications() {
        return applicationRepository.findAllByOrderByAppliedDateDesc().stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    public List<ApplicationDto> getApplicationsByStudentId(Long studentId) {
        return applicationRepository.findByStudentIdOrderByAppliedDateDesc(studentId).stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    public List<ApplicationDto> getApplicationsByJobId(Long jobId) {
        Job job = jobRepository.findById(jobId)
                .orElseThrow(() -> new ResourceNotFoundException("Job not found with id: " + jobId));
        return applicationRepository.findByJobOrderByAppliedDateDesc(job).stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    public ApplicationDto getApplicationById(Long id) {
        Application application = applicationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Application not found with id: " + id));
        return mapToDto(application);
    }

    public Application getApplicationEntityById(Long id) {
        return applicationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Application not found with id: " + id));
    }

    public ApplicationDto mapToDto(Application a) {
        ApplicationDto dto = new ApplicationDto();
        dto.setId(a.getId());
        dto.setApplicationType(a.getApplicationType());
        dto.setStatus(a.getStatus());
        dto.setAppliedDate(a.getAppliedDate());
        dto.setNotes(a.getNotes());

        if (a.getStudent() != null) {
            dto.setStudentId(a.getStudent().getId());
            if (a.getStudent().getUser() != null) {
                dto.setStudentName(a.getStudent().getUser().getFullName());
                dto.setStudentEmail(a.getStudent().getUser().getEmail());
            }
            dto.setStudentDepartment(a.getStudent().getDepartment());
            dto.setStudentCgpa(a.getStudent().getCgpa());
            dto.setStudentSkills(a.getStudent().getSkills());
        }

        if (a.getJob() != null) {
            dto.setJobId(a.getJob().getId());
            dto.setJobTitle(a.getJob().getTitle());
            dto.setCompanyName(a.getJob().getCompany());
            dto.setPositionTitle(a.getJob().getTitle());
        } else if (a.getInternship() != null) {
            dto.setInternshipId(a.getInternship().getId());
            dto.setInternshipTitle(a.getInternship().getTitle());
            dto.setCompanyName(a.getInternship().getCompany());
            dto.setPositionTitle(a.getInternship().getTitle());
        }

        return dto;
    }
}
