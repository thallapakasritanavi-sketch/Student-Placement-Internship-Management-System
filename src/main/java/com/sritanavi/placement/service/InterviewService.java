package com.sritanavi.placement.service;

import com.sritanavi.placement.dto.InterviewDto;
import com.sritanavi.placement.entity.*;
import com.sritanavi.placement.exception.BadRequestException;
import com.sritanavi.placement.exception.ResourceNotFoundException;
import com.sritanavi.placement.repository.ApplicationRepository;
import com.sritanavi.placement.repository.InterviewRepository;
import com.sritanavi.placement.repository.StudentRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class InterviewService {

    private final InterviewRepository interviewRepository;
    private final StudentRepository studentRepository;
    private final ApplicationRepository applicationRepository;
    private final NotificationService notificationService;

    public InterviewService(InterviewRepository interviewRepository,
                            StudentRepository studentRepository,
                            ApplicationRepository applicationRepository,
                            NotificationService notificationService) {
        this.interviewRepository = interviewRepository;
        this.studentRepository = studentRepository;
        this.applicationRepository = applicationRepository;
        this.notificationService = notificationService;
    }

    public List<InterviewDto> getAllInterviews() {
        return interviewRepository.findAllByOrderByInterviewDateAsc().stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    public List<InterviewDto> getInterviewsByStudentId(Long studentId) {
        return interviewRepository.findByStudentIdOrderByInterviewDateAsc(studentId).stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Transactional
    public InterviewDto scheduleInterview(InterviewDto dto) {
        if (dto.getStudentId() == null) {
            throw new BadRequestException("Student ID is required to schedule interview");
        }

        Student student = studentRepository.findById(dto.getStudentId())
                .orElseThrow(() -> new ResourceNotFoundException("Student not found with id: " + dto.getStudentId()));

        Application application = null;
        if (dto.getApplicationId() != null) {
            application = applicationRepository.findById(dto.getApplicationId()).orElse(null);
            if (application != null) {
                application.setStatus(ApplicationStatus.INTERVIEW_SCHEDULED);
                applicationRepository.save(application);
            }
        }

        Interview interview = new Interview();
        interview.setStudent(student);
        interview.setApplication(application);
        interview.setCompanyName(dto.getCompanyName().trim());
        interview.setPosition(dto.getPosition().trim());
        interview.setInterviewDate(dto.getInterviewDate());
        interview.setInterviewTime(dto.getInterviewTime());
        interview.setInterviewMode(dto.getInterviewMode() != null ? dto.getInterviewMode() : InterviewMode.ONLINE);
        interview.setMeetingLinkOrLocation(dto.getMeetingLinkOrLocation());
        interview.setStatus(dto.getStatus() != null ? dto.getStatus() : InterviewStatus.SCHEDULED);
        interview.setNotes(dto.getNotes());

        Interview saved = interviewRepository.save(interview);

        // Send interview notification
        if (student.getUser() != null) {
            String details = "Your interview for " + dto.getPosition() + " at " + dto.getCompanyName() +
                    " has been scheduled on " + dto.getInterviewDate() +
                    (dto.getInterviewTime() != null ? " at " + dto.getInterviewTime() : "") +
                    " (" + interview.getInterviewMode() + ").";
            notificationService.createNotification(
                    student.getUser(),
                    "Interview Scheduled: " + dto.getCompanyName(),
                    details,
                    "INTERVIEW"
            );
        }

        return mapToDto(saved);
    }

    @Transactional
    public InterviewDto updateInterview(Long id, InterviewDto dto) {
        Interview interview = interviewRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Interview not found with id: " + id));

        if (dto.getInterviewDate() != null) interview.setInterviewDate(dto.getInterviewDate());
        if (dto.getInterviewTime() != null) interview.setInterviewTime(dto.getInterviewTime());
        if (dto.getInterviewMode() != null) interview.setInterviewMode(dto.getInterviewMode());
        if (dto.getMeetingLinkOrLocation() != null) interview.setMeetingLinkOrLocation(dto.getMeetingLinkOrLocation());
        if (dto.getStatus() != null) interview.setStatus(dto.getStatus());
        if (dto.getNotes() != null) interview.setNotes(dto.getNotes());

        Interview updated = interviewRepository.save(interview);
        return mapToDto(updated);
    }

    @Transactional
    public void deleteInterview(Long id) {
        if (!interviewRepository.existsById(id)) {
            throw new ResourceNotFoundException("Interview not found with id: " + id);
        }
        interviewRepository.deleteById(id);
    }

    private InterviewDto mapToDto(Interview i) {
        InterviewDto dto = new InterviewDto();
        dto.setId(i.getId());
        if (i.getStudent() != null) {
            dto.setStudentId(i.getStudent().getId());
            if (i.getStudent().getUser() != null) {
                dto.setStudentName(i.getStudent().getUser().getFullName());
                dto.setStudentEmail(i.getStudent().getUser().getEmail());
            }
        }
        if (i.getApplication() != null) {
            dto.setApplicationId(i.getApplication().getId());
        }
        dto.setCompanyName(i.getCompanyName());
        dto.setPosition(i.getPosition());
        dto.setInterviewDate(i.getInterviewDate());
        dto.setInterviewTime(i.getInterviewTime());
        dto.setInterviewMode(i.getInterviewMode());
        dto.setMeetingLinkOrLocation(i.getMeetingLinkOrLocation());
        dto.setStatus(i.getStatus());
        dto.setNotes(i.getNotes());
        dto.setCreatedAt(i.getCreatedAt());
        return dto;
    }
}
