package com.sritanavi.placement.repository;

import com.sritanavi.placement.entity.Internship;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface InternshipRepository extends JpaRepository<Internship, Long> {
    List<Internship> findByStatusOrderByCreatedAtDesc(String status);
    List<Internship> findAllByOrderByCreatedAtDesc();
    List<Internship> findByCompanyIgnoreCase(String company);

    @Query("SELECT i FROM Internship i WHERE " +
           "(:keyword IS NULL OR :keyword = '' OR " +
           "LOWER(i.title) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(i.company) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(i.requiredSkills) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(i.location) LIKE LOWER(CONCAT('%', :keyword, '%'))) AND " +
           "(:location IS NULL OR :location = '' OR LOWER(i.location) LIKE LOWER(CONCAT('%', :location, '%'))) " +
           "ORDER BY i.createdAt DESC")
    List<Internship> searchInternships(@Param("keyword") String keyword,
                                       @Param("location") String location);
}
