package com.sritanavi.placement.repository;

import com.sritanavi.placement.entity.Student;
import com.sritanavi.placement.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface StudentRepository extends JpaRepository<Student, Long> {
    Optional<Student> findByUser(User user);
    Optional<Student> findByUserId(Long userId);
    Optional<Student> findByUserEmail(String email);
}
