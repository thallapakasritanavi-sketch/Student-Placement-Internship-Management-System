package com.sritanavi.placement.repository;

import com.sritanavi.placement.entity.Interview;
import com.sritanavi.placement.entity.InterviewStatus;
import com.sritanavi.placement.entity.Student;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface InterviewRepository extends JpaRepository<Interview, Long> {
    List<Interview> findByStudentOrderByInterviewDateAsc(Student student);
    List<Interview> findByStudentIdOrderByInterviewDateAsc(Long studentId);
    List<Interview> findAllByOrderByInterviewDateAsc();
    List<Interview> findByInterviewDateGreaterThanEqualOrderByInterviewDateAsc(LocalDate date);
    long countByStatus(InterviewStatus status);
}
