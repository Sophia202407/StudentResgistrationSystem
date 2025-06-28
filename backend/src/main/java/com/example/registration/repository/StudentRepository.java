package com.example.registration.repository;

import com.example.registration.model.Student;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface StudentRepository extends JpaRepository<Student, Long> {
    Optional<Student> findByEmail(String email);
    
    // Search methods
    List<Student> findByNameContainingIgnoreCase(String name);
    List<Student> findByEmailContainingIgnoreCase(String email);
    List<Student> findByEnrollmentDate(LocalDate enrollmentDate);
    List<Student> findByEnrollmentDateBetween(LocalDate startDate, LocalDate endDate);
    
    // Combined search query
    @Query("SELECT s FROM Student s WHERE " +
           "LOWER(s.name) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(s.email) LIKE LOWER(CONCAT('%', :keyword, '%'))")
    List<Student> findByKeyword(@Param("keyword") String keyword);
    
    // Statistics queries
    @Query("SELECT COUNT(s) FROM Student s WHERE s.enrollmentDate = :date")
    Long countByEnrollmentDate(@Param("date") LocalDate date);
    
    @Query("SELECT COUNT(s) FROM Student s WHERE s.enrollmentDate BETWEEN :startDate AND :endDate")
    Long countByEnrollmentDateBetween(@Param("startDate") LocalDate startDate, @Param("endDate") LocalDate endDate);
    
    // Check if student exists by email (excluding specific ID for updates)
    @Query("SELECT CASE WHEN COUNT(s) > 0 THEN true ELSE false END FROM Student s WHERE s.email = :email AND s.id != :id")
    boolean existsByEmailAndIdNot(@Param("email") String email, @Param("id") Long id);
}