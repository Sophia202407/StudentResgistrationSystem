package com.example.registration.service;

import com.example.registration.exception.DuplicateStudentException;
import com.example.registration.exception.StudentNotFoundException;
import com.example.registration.model.Student;
import com.example.registration.repository.StudentRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class StudentService {
    private final StudentRepository studentRepository;

    public StudentService(StudentRepository studentRepository) {
        this.studentRepository = studentRepository;
    }

    // Create
    public Student addStudent(Student student) {
        if (studentRepository.findByEmail(student.getEmail()).isPresent()) {
            throw new DuplicateStudentException("Student with email '" + student.getEmail() + "' already exists.");
        }
        return studentRepository.save(student);
    }

    // Read - Get all students
    @Transactional(readOnly = true)
    public List<Student> getAllStudents() {
        return studentRepository.findAll(Sort.by(Sort.Direction.DESC, "id"));
    }

    // Read - Get students with pagination
    @Transactional(readOnly = true)
    public Page<Student> getAllStudents(Pageable pageable) {
        return studentRepository.findAll(pageable);
    }

    // Read - Get student by ID
    @Transactional(readOnly = true)
    public Student getStudentById(Long id) {
        return studentRepository.findById(id)
                .orElseThrow(() -> new StudentNotFoundException("Student not found with id: " + id));
    }

    // Read - Get student by email
    @Transactional(readOnly = true)
    public Optional<Student> getStudentByEmail(String email) {
        return studentRepository.findByEmail(email);
    }

    // Update
    public Student updateStudent(Long id, Student updatedStudent) {
        Student existingStudent = studentRepository.findById(id)
                .orElseThrow(() -> new StudentNotFoundException("Student not found with id: " + id));
        
        // Check for email uniqueness (excluding current student)
        if (!existingStudent.getEmail().equals(updatedStudent.getEmail()) && 
            studentRepository.existsByEmailAndIdNot(updatedStudent.getEmail(), id)) {
            throw new DuplicateStudentException("Student with email '" + updatedStudent.getEmail() + "' already exists.");
        }
        
        existingStudent.setName(updatedStudent.getName());
        existingStudent.setEmail(updatedStudent.getEmail());
        existingStudent.setEnrollmentDate(updatedStudent.getEnrollmentDate());
        return studentRepository.save(existingStudent);
    }

    // Delete
    public void deleteStudent(Long id) {
        if (!studentRepository.existsById(id)) {
            throw new StudentNotFoundException("Student not found with id: " + id);
        }
        studentRepository.deleteById(id);
    }

    // Delete multiple students
    public void deleteStudents(List<Long> ids) {
        List<Student> studentsToDelete = studentRepository.findAllById(ids);
        if (studentsToDelete.size() != ids.size()) {
            throw new StudentNotFoundException("One or more students not found");
        }
        studentRepository.deleteAllById(ids);
    }

    // Search functionality
    @Transactional(readOnly = true)
    public List<Student> searchStudents(String keyword) {
        if (keyword == null || keyword.trim().isEmpty()) {
            return getAllStudents();
        }
        return studentRepository.findByKeyword(keyword.trim());
    }

    @Transactional(readOnly = true)
    public List<Student> searchByName(String name) {
        return studentRepository.findByNameContainingIgnoreCase(name);
    }

    @Transactional(readOnly = true)
    public List<Student> searchByEmail(String email) {
        return studentRepository.findByEmailContainingIgnoreCase(email);
    }

    @Transactional(readOnly = true)
    public List<Student> getStudentsByEnrollmentDate(LocalDate date) {
        return studentRepository.findByEnrollmentDate(date);
    }

    @Transactional(readOnly = true)
    public List<Student> getStudentsByEnrollmentDateRange(LocalDate startDate, LocalDate endDate) {
        return studentRepository.findByEnrollmentDateBetween(startDate, endDate);
    }

    // Statistics
    @Transactional(readOnly = true)
    public long getTotalStudentCount() {
        return studentRepository.count();
    }

    @Transactional(readOnly = true)
    public long getStudentCountByDate(LocalDate date) {
        return studentRepository.countByEnrollmentDate(date);
    }

    @Transactional(readOnly = true)
    public long getStudentCountByDateRange(LocalDate startDate, LocalDate endDate) {
        return studentRepository.countByEnrollmentDateBetween(startDate, endDate);
    }

    // Bulk operations
    public List<Student> addStudents(List<Student> students) {
        // Validate for duplicate emails
        for (Student student : students) {
            if (studentRepository.findByEmail(student.getEmail()).isPresent()) {
                throw new DuplicateStudentException("Student with email '" + student.getEmail() + "' already exists.");
            }
        }
        return studentRepository.saveAll(students);
    }

    // Utility methods
    @Transactional(readOnly = true)
    public boolean existsByEmail(String email) {
        return studentRepository.findByEmail(email).isPresent();
    }

    @Transactional(readOnly = true)
    public boolean existsById(Long id) {
        return studentRepository.existsById(id);
    }
}