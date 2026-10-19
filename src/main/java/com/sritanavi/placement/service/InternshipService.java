package com.sritanavi.placement.service;

import com.sritanavi.placement.dto.InternshipDto;
import com.sritanavi.placement.entity.Company;
import com.sritanavi.placement.entity.Internship;
import com.sritanavi.placement.entity.Student;
import com.sritanavi.placement.exception.ResourceNotFoundException;
import com.sritanavi.placement.repository.ApplicationRepository;
import com.sritanavi.placement.repository.CompanyRepository;
import com.sritanavi.placement.repository.InternshipRepository;
import com.sritanavi.placement.repository.StudentRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class InternshipService {

    private final InternshipRepository internshipRepository;
    private final CompanyRepository companyRepository;
    private final ApplicationRepository applicationRepository;
    private final StudentRepository studentRepository;

    public InternshipService(InternshipRepository internshipRepository,
                             CompanyRepository companyRepository,
                             ApplicationRepository applicationRepository,
                             StudentRepository studentRepository) {
        this.internshipRepository = internshipRepository;
        this.companyRepository = companyRepository;
        this.applicationRepository = applicationRepository;
        this.studentRepository = studentRepository;
    }

    public List<InternshipDto> getAllInternships(Long currentStudentId) {
        Student student = currentStudentId != null ? studentRepository.findById(currentStudentId).orElse(null) : null;
        return internshipRepository.findAllByOrderByCreatedAtDesc().stream()
                .map(internship -> mapToDto(internship, student))
                .collect(Collectors.toList());
    }

    public List<InternshipDto> searchInternships(String keyword, String location, Long currentStudentId) {
        Student student = currentStudentId != null ? studentRepository.findById(currentStudentId).orElse(null) : null;
        return internshipRepository.searchInternships(keyword, location).stream()
                .map(internship -> mapToDto(internship, student))
                .collect(Collectors.toList());
    }

    public InternshipDto getInternshipById(Long id, Long currentStudentId) {
        Internship internship = internshipRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Internship not found with id: " + id));
        Student student = currentStudentId != null ? studentRepository.findById(currentStudentId).orElse(null) : null;
        return mapToDto(internship, student);
    }

    @Transactional
    public InternshipDto createInternship(InternshipDto dto) {
        Internship internship = new Internship();
        internship.setTitle(dto.getTitle().trim());
        internship.setCompany(dto.getCompany().trim());
        internship.setLocation(dto.getLocation());
        internship.setDuration(dto.getDuration() != null ? dto.getDuration() : "3 Months");
        internship.setStipend(dto.getStipend());
        internship.setMinCgpa(dto.getMinCgpa() != null ? dto.getMinCgpa() : 6.0);
        internship.setRequiredSkills(dto.getRequiredSkills());
        internship.setDescription(dto.getDescription());
        internship.setDeadline(dto.getDeadline());
        internship.setOpenings(dto.getOpenings() != null ? dto.getOpenings() : 1);
        internship.setStatus(dto.getStatus() != null ? dto.getStatus() : "ACTIVE");

        if (!companyRepository.existsByName(dto.getCompany().trim())) {
            Company company = new Company();
            company.setName(dto.getCompany().trim());
            company.setLocation(dto.getLocation());
            companyRepository.save(company);
        }

        Internship saved = internshipRepository.save(internship);
        return mapToDto(saved, null);
    }

    @Transactional
    public InternshipDto updateInternship(Long id, InternshipDto dto) {
        Internship internship = internshipRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Internship not found with id: " + id));

        if (dto.getTitle() != null) internship.setTitle(dto.getTitle().trim());
        if (dto.getCompany() != null) internship.setCompany(dto.getCompany().trim());
        if (dto.getLocation() != null) internship.setLocation(dto.getLocation());
        if (dto.getDuration() != null) internship.setDuration(dto.getDuration());
        if (dto.getStipend() != null) internship.setStipend(dto.getStipend());
        if (dto.getMinCgpa() != null) internship.setMinCgpa(dto.getMinCgpa());
        if (dto.getRequiredSkills() != null) internship.setRequiredSkills(dto.getRequiredSkills());
        if (dto.getDescription() != null) internship.setDescription(dto.getDescription());
        if (dto.getDeadline() != null) internship.setDeadline(dto.getDeadline());
        if (dto.getOpenings() != null) internship.setOpenings(dto.getOpenings());
        if (dto.getStatus() != null) internship.setStatus(dto.getStatus());

        Internship updated = internshipRepository.save(internship);
        return mapToDto(updated, null);
    }

    @Transactional
    public void deleteInternship(Long id) {
        if (!internshipRepository.existsById(id)) {
            throw new ResourceNotFoundException("Internship not found with id: " + id);
        }
        internshipRepository.deleteById(id);
    }

    public Internship getInternshipEntityById(Long id) {
        return internshipRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Internship not found with id: " + id));
    }

    public InternshipDto mapToDto(Internship internship, Student student) {
        InternshipDto dto = new InternshipDto();
        dto.setId(internship.getId());
        dto.setTitle(internship.getTitle());
        dto.setCompany(internship.getCompany());
        dto.setLocation(internship.getLocation());
        dto.setDuration(internship.getDuration());
        dto.setStipend(internship.getStipend());
        dto.setMinCgpa(internship.getMinCgpa());
        dto.setRequiredSkills(internship.getRequiredSkills());
        dto.setDescription(internship.getDescription());
        dto.setDeadline(internship.getDeadline());
        dto.setOpenings(internship.getOpenings());
        dto.setStatus(internship.getStatus());
        dto.setCreatedAt(internship.getCreatedAt());

        if (student != null) {
            dto.setAppliedByCurrentStudent(applicationRepository.existsByStudentAndInternship(student, internship));
        }
        return dto;
    }
}
