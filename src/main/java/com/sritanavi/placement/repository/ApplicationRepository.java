package com.sritanavi.placement.repository;

import com.sritanavi.placement.entity.Application;
import com.sritanavi.placement.entity.ApplicationStatus;
import com.sritanavi.placement.entity.Job;
import com.sritanavi.placement.entity.Internship;
import com.sritanavi.placement.entity.Student;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ApplicationRepository extends JpaRepository<Application, Long> {
    List<Application> findByStudentOrderByAppliedDateDesc(Student student);
    List<Application> findByStudentIdOrderByAppliedDateDesc(Long studentId);
    List<Application> findByJobOrderByAppliedDateDesc(Job job);
    List<Application> findByInternshipOrderByAppliedDateDesc(Internship internship);
    List<Application> findAllByOrderByAppliedDateDesc();

    boolean existsByStudentAndJob(Student student, Job job);
    boolean existsByStudentAndInternship(Student student, Internship internship);

    long countByStatus(ApplicationStatus status);
    long countByStudentAndStatus(Student student, ApplicationStatus status);
    long countByStudent(Student student);

    @Query("SELECT COUNT(a) FROM Application a WHERE a.job.company = :company OR a.internship.company = :company")
    long countByCompany(@Param("company") String company);

    @Query("SELECT a FROM Application a WHERE a.job.company = :company OR a.internship.company = :company ORDER BY a.appliedDate DESC")
    List<Application> findByCompany(@Param("company") String company);
}
