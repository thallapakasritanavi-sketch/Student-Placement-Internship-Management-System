package com.sritanavi.placement.repository;

import com.sritanavi.placement.entity.Job;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface JobRepository extends JpaRepository<Job, Long> {
    List<Job> findByStatusOrderByCreatedAtDesc(String status);
    List<Job> findAllByOrderByCreatedAtDesc();
    List<Job> findByCompanyIgnoreCase(String company);

    @Query("SELECT j FROM Job j WHERE " +
           "(:keyword IS NULL OR :keyword = '' OR " +
           "LOWER(j.title) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(j.company) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(j.requiredSkills) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(j.location) LIKE LOWER(CONCAT('%', :keyword, '%'))) AND " +
           "(:location IS NULL OR :location = '' OR LOWER(j.location) LIKE LOWER(CONCAT('%', :location, '%'))) AND " +
           "(:jobType IS NULL OR :jobType = '' OR LOWER(j.jobType) = LOWER(:jobType)) " +
           "ORDER BY j.createdAt DESC")
    List<Job> searchJobs(@Param("keyword") String keyword,
                         @Param("location") String location,
                         @Param("jobType") String jobType);
}
