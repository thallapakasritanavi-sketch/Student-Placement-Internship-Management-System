package com.sritanavi.placement.service;

import com.sritanavi.placement.dto.JobDto;
import com.sritanavi.placement.entity.Company;
import com.sritanavi.placement.entity.Job;
import com.sritanavi.placement.entity.Student;
import com.sritanavi.placement.exception.ResourceNotFoundException;
import com.sritanavi.placement.repository.ApplicationRepository;
import com.sritanavi.placement.repository.CompanyRepository;
import com.sritanavi.placement.repository.JobRepository;
import com.sritanavi.placement.repository.StudentRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class JobService {

    private final JobRepository jobRepository;
    private final CompanyRepository companyRepository;
    private final ApplicationRepository applicationRepository;
    private final StudentRepository studentRepository;

    public JobService(JobRepository jobRepository,
                      CompanyRepository companyRepository,
                      ApplicationRepository applicationRepository,
                      StudentRepository studentRepository) {
        this.jobRepository = jobRepository;
        this.companyRepository = companyRepository;
        this.applicationRepository = applicationRepository;
        this.studentRepository = studentRepository;
    }

    public List<JobDto> getAllJobs(Long currentStudentId) {
        Student student = currentStudentId != null ? studentRepository.findById(currentStudentId).orElse(null) : null;
        return jobRepository.findAllByOrderByCreatedAtDesc().stream()
                .map(job -> mapToDto(job, student))
                .collect(Collectors.toList());
    }

    public List<JobDto> searchJobs(String keyword, String location, String jobType, Long currentStudentId) {
        Student student = currentStudentId != null ? studentRepository.findById(currentStudentId).orElse(null) : null;
        return jobRepository.searchJobs(keyword, location, jobType).stream()
                .map(job -> mapToDto(job, student))
                .collect(Collectors.toList());
    }

    public JobDto getJobById(Long id, Long currentStudentId) {
        Job job = jobRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Job not found with id: " + id));
        Student student = currentStudentId != null ? studentRepository.findById(currentStudentId).orElse(null) : null;
        return mapToDto(job, student);
    }

    @Transactional
    public JobDto createJob(JobDto dto) {
        Job job = new Job();
        job.setTitle(dto.getTitle().trim());
        job.setCompany(dto.getCompany().trim());
        job.setLocation(dto.getLocation());
        job.setJobType(dto.getJobType() != null ? dto.getJobType() : "Full-Time");
        job.setSalary(dto.getSalary());
        job.setMinCgpa(dto.getMinCgpa() != null ? dto.getMinCgpa() : 6.0);
        job.setRequiredSkills(dto.getRequiredSkills());
        job.setDescription(dto.getDescription());
        job.setDeadline(dto.getDeadline());
        job.setOpenings(dto.getOpenings() != null ? dto.getOpenings() : 1);
        job.setStatus(dto.getStatus() != null ? dto.getStatus() : "ACTIVE");

        // Ensure company is saved
        if (!companyRepository.existsByName(dto.getCompany().trim())) {
            Company company = new Company();
            company.setName(dto.getCompany().trim());
            company.setLocation(dto.getLocation());
            companyRepository.save(company);
        }

        Job saved = jobRepository.save(job);
        return mapToDto(saved, null);
    }

    @Transactional
    public JobDto updateJob(Long id, JobDto dto) {
        Job job = jobRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Job not found with id: " + id));

        if (dto.getTitle() != null) job.setTitle(dto.getTitle().trim());
        if (dto.getCompany() != null) job.setCompany(dto.getCompany().trim());
        if (dto.getLocation() != null) job.setLocation(dto.getLocation());
        if (dto.getJobType() != null) job.setJobType(dto.getJobType());
        if (dto.getSalary() != null) job.setSalary(dto.getSalary());
        if (dto.getMinCgpa() != null) job.setMinCgpa(dto.getMinCgpa());
        if (dto.getRequiredSkills() != null) job.setRequiredSkills(dto.getRequiredSkills());
        if (dto.getDescription() != null) job.setDescription(dto.getDescription());
        if (dto.getDeadline() != null) job.setDeadline(dto.getDeadline());
        if (dto.getOpenings() != null) job.setOpenings(dto.getOpenings());
        if (dto.getStatus() != null) job.setStatus(dto.getStatus());

        Job updated = jobRepository.save(job);
        return mapToDto(updated, null);
    }

    @Transactional
    public void deleteJob(Long id) {
        if (!jobRepository.existsById(id)) {
            throw new ResourceNotFoundException("Job not found with id: " + id);
        }
        jobRepository.deleteById(id);
    }

    public Job getJobEntityById(Long id) {
        return jobRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Job not found with id: " + id));
    }

    public JobDto mapToDto(Job job, Student student) {
        JobDto dto = new JobDto();
        dto.setId(job.getId());
        dto.setTitle(job.getTitle());
        dto.setCompany(job.getCompany());
        dto.setLocation(job.getLocation());
        dto.setJobType(job.getJobType());
        dto.setSalary(job.getSalary());
        dto.setMinCgpa(job.getMinCgpa());
        dto.setRequiredSkills(job.getRequiredSkills());
        dto.setDescription(job.getDescription());
        dto.setDeadline(job.getDeadline());
        dto.setOpenings(job.getOpenings());
        dto.setStatus(job.getStatus());
        dto.setCreatedAt(job.getCreatedAt());

        if (student != null) {
            dto.setAppliedByCurrentStudent(applicationRepository.existsByStudentAndJob(student, job));
        }
        return dto;
    }
}
