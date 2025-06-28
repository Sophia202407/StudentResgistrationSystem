package com.example.registration.controller;

import com.example.registration.model.Student;
import com.example.registration.service.StudentService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173"})
@RestController
@RequestMapping("/api/students")
public class StudentController {
    private final StudentService studentService;

    public StudentController(StudentService studentService) {
        this.studentService = studentService;
    }

    // Create - Add new student
    @PostMapping
    public ResponseEntity<Student> addStudent(@Valid @RequestBody Student student) {
        Student savedStudent = studentService.addStudent(student);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedStudent);
    }

    // Create - Add multiple students (bulk operation)
    @PostMapping("/bulk")
    public ResponseEntity<List<Student>> addStudents(@Valid @RequestBody List<Student> students) {
        List<Student> savedStudents = studentService.addStudents(students);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedStudents);
    }

    // Read - Get all students
    @GetMapping
    public ResponseEntity<List<Student>> getAllStudents() {
        List<Student> students = studentService.getAllStudents();
        return ResponseEntity.ok(students);
    }

    // Read - Get students with pagination
    @GetMapping("/paginated")
    public ResponseEntity<Page<Student>> getAllStudents(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "id") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir) {
        
        Sort sort = sortDir.equalsIgnoreCase("desc") ? 
            Sort.by(sortBy).descending() : 
            Sort.by(sortBy).ascending();
        
        Pageable pageable = PageRequest.of(page, size, sort);
        Page<Student> students = studentService.getAllStudents(pageable);
        return ResponseEntity.ok(students);
    }

    // Read - Get student by ID
    @GetMapping("/{id}")
    public ResponseEntity<Student> getStudentById(@PathVariable Long id) {
        Student student = studentService.getStudentById(id);
        return ResponseEntity.ok(student);
    }

    // Read - Get student by email
    @GetMapping("/email/{email}")
    public ResponseEntity<Student> getStudentByEmail(@PathVariable String email) {
        return studentService.getStudentByEmail(email)
                .map(student -> ResponseEntity.ok(student))
                .orElse(ResponseEntity.notFound().build());
    }

    // Update - Update existing student
    @PutMapping("/{id}")
    public ResponseEntity<Student> updateStudent(@PathVariable Long id, @Valid @RequestBody Student student) {
        Student updatedStudent = studentService.updateStudent(id, student);
        return ResponseEntity.ok(updatedStudent);
    }

    // Delete - Delete student by ID
    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, String>> deleteStudent(@PathVariable Long id) {
        studentService.deleteStudent(id);
        Map<String, String> response = new HashMap<>();
        response.put("message", "Student deleted successfully");
        response.put("deletedId", String.valueOf(id));
        return ResponseEntity.ok(response);
    }

    // Delete - Delete multiple students
    @DeleteMapping("/bulk")
    public ResponseEntity<Map<String, String>> deleteStudents(@RequestBody List<Long> ids) {
        studentService.deleteStudents(ids);
        Map<String, String> response = new HashMap<>();
        response.put("message", "Students deleted successfully");
        response.put("deletedCount", String.valueOf(ids.size()));
        return ResponseEntity.ok(response);
    }

    // Search - General search
    @GetMapping("/search")
    public ResponseEntity<List<Student>> searchStudents(@RequestParam String keyword) {
        List<Student> students = studentService.searchStudents(keyword);
        return ResponseEntity.ok(students);
    }

    // Search - Search by name
    @GetMapping("/search/name")
    public ResponseEntity<List<Student>> searchByName(@RequestParam String name) {
        List<Student> students = studentService.searchByName(name);
        return ResponseEntity.ok(students);
    }

    // Search - Search by email
    @GetMapping("/search/email")
    public ResponseEntity<List<Student>> searchByEmail(@RequestParam String email) {
        List<Student> students = studentService.searchByEmail(email);
        return ResponseEntity.ok(students);
    }

    // Search - Get students by enrollment date
    @GetMapping("/enrollment-date/{date}")
    public ResponseEntity<List<Student>> getStudentsByEnrollmentDate(
            @PathVariable @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        List<Student> students = studentService.getStudentsByEnrollmentDate(date);
        return ResponseEntity.ok(students);
    }

    // Search - Get students by enrollment date range
    @GetMapping("/enrollment-date-range")
    public ResponseEntity<List<Student>> getStudentsByEnrollmentDateRange(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        List<Student> students = studentService.getStudentsByEnrollmentDateRange(startDate, endDate);
        return ResponseEntity.ok(students);
    }

    // Statistics - Get total count
    @GetMapping("/count")
    public ResponseEntity<Map<String, Long>> getTotalStudentCount() {
        long count = studentService.getTotalStudentCount();
        Map<String, Long> response = new HashMap<>();
        response.put("totalCount", count);
        return ResponseEntity.ok(response);
    }

    // Statistics - Get count by date
    @GetMapping("/count/date/{date}")
    public ResponseEntity<Map<String, Long>> getStudentCountByDate(
            @PathVariable @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        long count = studentService.getStudentCountByDate(date);
        Map<String, Long> response = new HashMap<>();
        response.put("count", count);
        response.put("date", java.time.LocalDate.now().toEpochDay()); // For reference
        return ResponseEntity.ok(response);
    }

    // Statistics - Get count by date range
    @GetMapping("/count/date-range")
    public ResponseEntity<Map<String, Object>> getStudentCountByDateRange(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        long count = studentService.getStudentCountByDateRange(startDate, endDate);
        Map<String, Object> response = new HashMap<>();
        response.put("count", count);
        response.put("startDate", startDate);
        response.put("endDate", endDate);
        return ResponseEntity.ok(response);
    }

    // Utility - Check if student exists by email
    @GetMapping("/exists/email/{email}")
    public ResponseEntity<Map<String, Boolean>> checkEmailExists(@PathVariable String email) {
        boolean exists = studentService.existsByEmail(email);
        Map<String, Boolean> response = new HashMap<>();
        response.put("exists", exists);
        return ResponseEntity.ok(response);
    }

    // Utility - Check if student exists by ID
    @GetMapping("/exists/{id}")
    public ResponseEntity<Map<String, Boolean>> checkStudentExists(@PathVariable Long id) {
        boolean exists = studentService.existsById(id);
        Map<String, Boolean> response = new HashMap<>();
        response.put("exists", exists);
        return ResponseEntity.ok(response);
    }
}