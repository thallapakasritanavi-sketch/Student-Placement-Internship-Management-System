package com.sritanavi.placement.service;

import com.sritanavi.placement.dto.StudentDto;
import com.sritanavi.placement.entity.Student;
import com.sritanavi.placement.entity.User;
import com.sritanavi.placement.exception.ResourceNotFoundException;
import com.sritanavi.placement.repository.StudentRepository;
import com.sritanavi.placement.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class StudentService {

    private final StudentRepository studentRepository;
    private final UserRepository userRepository;

    public StudentService(StudentRepository studentRepository, UserRepository userRepository) {
        this.studentRepository = studentRepository;
        this.userRepository = userRepository;
    }

    public List<StudentDto> getAllStudents() {
        return studentRepository.findAll().stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    public StudentDto getStudentById(Long id) {
        Student student = studentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found with id: " + id));
        return mapToDto(student);
    }

    public StudentDto getStudentByUserId(Long userId) {
        Student student = studentRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Student profile not found for user id: " + userId));
        return mapToDto(student);
    }

    @Transactional
    public StudentDto updateStudent(Long id, StudentDto dto) {
        Student student = studentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found with id: " + id));

        User user = student.getUser();
        if (dto.getFullName() != null && !dto.getFullName().trim().isEmpty()) {
            user.setFullName(dto.getFullName().trim());
        }
        if (dto.getPhone() != null) {
            user.setPhone(dto.getPhone().trim());
        }
        userRepository.save(user);

        if (dto.getCollege() != null) student.setCollege(dto.getCollege());
        if (dto.getDegree() != null) student.setDegree(dto.getDegree());
        if (dto.getDepartment() != null) student.setDepartment(dto.getDepartment());
        if (dto.getGraduationYear() != null) student.setGraduationYear(dto.getGraduationYear());
        if (dto.getCgpa() != null) student.setCgpa(dto.getCgpa());
        if (dto.getLocation() != null) student.setLocation(dto.getLocation());
        if (dto.getSkills() != null) student.setSkills(dto.getSkills());
        if (dto.getCertifications() != null) student.setCertifications(dto.getCertifications());
        if (dto.getProjects() != null) student.setProjects(dto.getProjects());
        if (dto.getResumeUrl() != null) student.setResumeUrl(dto.getResumeUrl());

        student.calculateProfileCompletion();
        Student updated = studentRepository.save(student);
        return mapToDto(updated);
    }

    public Student getStudentEntityById(Long id) {
        return studentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found with id: " + id));
    }

    public StudentDto mapToDto(Student s) {
        StudentDto dto = new StudentDto();
        dto.setId(s.getId());
        if (s.getUser() != null) {
            dto.setUserId(s.getUser().getId());
            dto.setFullName(s.getUser().getFullName());
            dto.setEmail(s.getUser().getEmail());
            dto.setPhone(s.getUser().getPhone());
        }
        dto.setCollege(s.getCollege());
        dto.setDegree(s.getDegree());
        dto.setDepartment(s.getDepartment());
        dto.setGraduationYear(s.getGraduationYear());
        dto.setCgpa(s.getCgpa());
        dto.setLocation(s.getLocation());
        dto.setSkills(s.getSkills());
        dto.setCertifications(s.getCertifications());
        dto.setProjects(s.getProjects());
        dto.setResumeUrl(s.getResumeUrl());
        dto.setProfileCompletedPercentage(s.getProfileCompletedPercentage());
        return dto;
    }
}
