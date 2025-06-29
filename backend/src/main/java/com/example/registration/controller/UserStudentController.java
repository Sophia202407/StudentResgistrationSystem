package com.example.registration.controller;

import com.example.registration.model.User;
import com.example.registration.payload.request.UpdateUserRequest;
import com.example.registration.security.services.UserPrincipal;
import com.example.registration.service.UserStudentService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173", "http://localhost:5174"})
@RestController
@RequestMapping("/api/students")
public class UserStudentController {
    private final UserStudentService userStudentService;

    public UserStudentController(UserStudentService userStudentService) {
        this.userStudentService = userStudentService;
    }

    // Helper method to get current username
    private String getCurrentUsername(Authentication authentication) {
        UserPrincipal userPrincipal = (UserPrincipal) authentication.getPrincipal();
        return userPrincipal.getUsername();
    }

    // Helper method to check if user is admin or moderator
    private boolean isAdminOrModerator(Authentication authentication) {
        return authentication.getAuthorities().stream()
                .anyMatch(authority -> authority.getAuthority().equals("ROLE_ADMIN") || 
                                     authority.getAuthority().equals("ROLE_MODERATOR"));
    }

    // Get all students (admin/moderator can see all, users see only themselves)
    @GetMapping
    public ResponseEntity<List<User>> getAllStudents(Authentication authentication) {
        if (isAdminOrModerator(authentication)) {
            // Admin and Moderator can see all students
            List<User> students = userStudentService.getAllStudents();
            return ResponseEntity.ok(students);
        } else {
            // Regular users can only see their own profile
            try {
                String username = getCurrentUsername(authentication);
                User currentStudent = userStudentService.getCurrentStudent(username);
                return ResponseEntity.ok(List.of(currentStudent));
            } catch (Exception e) {
                // User doesn't have student profile yet
                return ResponseEntity.ok(List.of());
            }
        }
    }

    // Get student by ID
    @GetMapping("/{id}")
    public ResponseEntity<User> getStudentById(@PathVariable Long id, Authentication authentication) {
        User student;
        
        if (isAdminOrModerator(authentication)) {
            // Admin and Moderator can access any student
            student = userStudentService.getStudentById(id);
        } else {
            // Regular users can only access their own profile
            String username = getCurrentUsername(authentication);
            User currentStudent = userStudentService.getCurrentStudent(username);
            
            if (!currentStudent.getId().equals(id)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
            }
            student = currentStudent;
        }
        
        return ResponseEntity.ok(student);
    }

    // Complete student profile (for new users who registered but haven't completed their student info)
    @PostMapping("/complete-profile")
    @PreAuthorize("hasRole('USER') or hasRole('MODERATOR') or hasRole('ADMIN')")
    public ResponseEntity<User> completeStudentProfile(
            @Valid @RequestBody Map<String, Object> profileData, 
            Authentication authentication) {
        
        String username = getCurrentUsername(authentication);
        String fullName = (String) profileData.get("fullName");
        String enrollmentDateStr = (String) profileData.get("enrollmentDate");
        
        java.time.LocalDate enrollmentDate = java.time.LocalDate.parse(enrollmentDateStr);
        
        User updatedUser = userStudentService.completeStudentProfile(username, fullName, enrollmentDate);
        return ResponseEntity.ok(updatedUser);
    }

    // Update student profile
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('USER') or hasRole('MODERATOR') or hasRole('ADMIN')")
    public ResponseEntity<User> updateStudent(@PathVariable Long id, @RequestBody UpdateUserRequest updateRequest, Authentication authentication) {
        User updatedStudent;
        
        if (isAdminOrModerator(authentication)) {
            // Admin and Moderator can update any student
            if (updateRequest.getRoles() != null && !updateRequest.getRoles().isEmpty()) {
                // Update with roles if provided
                updatedStudent = userStudentService.updateStudentWithRoles(id, updateRequest, updateRequest.getRoles());
            } else {
                // Standard update without roles
                updatedStudent = userStudentService.updateStudent(id, updateRequest);
            }
        } else {
            // Regular users can only update their own profile
            String username = getCurrentUsername(authentication);
            User currentStudent = userStudentService.getCurrentStudent(username);
            
            if (!currentStudent.getId().equals(id)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
            }
            
            updatedStudent = userStudentService.updateStudentProfile(username, updateRequest);
        }
        
        return ResponseEntity.ok(updatedStudent);
    }

    // Update current user's profile (self-update for regular users)
    @PutMapping("/profile")
    @PreAuthorize("hasRole('USER') or hasRole('MODERATOR') or hasRole('ADMIN')")
    public ResponseEntity<User> updateMyProfile(@RequestBody UpdateUserRequest profileUpdate, Authentication authentication) {
        String username = getCurrentUsername(authentication);
        User updatedUser = userStudentService.updateStudentProfile(username, profileUpdate);
        return ResponseEntity.ok(updatedUser);
    }

    // Delete student (admin/moderator only, or self-deletion)
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('USER') or hasRole('MODERATOR') or hasRole('ADMIN')")
    public ResponseEntity<Map<String, String>> deleteStudent(@PathVariable Long id, Authentication authentication) {
        Map<String, String> response = new HashMap<>();
        
        if (isAdminOrModerator(authentication)) {
            // Admin and Moderator can delete any student
            userStudentService.deleteStudent(id);
            response.put("message", "Student deleted successfully");
        } else {
            // Regular users can only delete their own profile
            String username = getCurrentUsername(authentication);
            User currentStudent = userStudentService.getCurrentStudent(username);
            
            if (!currentStudent.getId().equals(id)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
            }
            
            userStudentService.deleteStudent(id);
            response.put("message", "Your profile deleted successfully");
        }
        
        response.put("deletedId", String.valueOf(id));
        return ResponseEntity.ok(response);
    }

    // Search students (admin/moderator only)
    @GetMapping("/search")
    @PreAuthorize("hasRole('MODERATOR') or hasRole('ADMIN')")
    public ResponseEntity<List<User>> searchStudents(@RequestParam String keyword) {
        List<User> students = userStudentService.searchStudents(keyword);
        return ResponseEntity.ok(students);
    }

    // Get current user's student profile
    @GetMapping("/me")
    @PreAuthorize("hasRole('USER') or hasRole('MODERATOR') or hasRole('ADMIN')")
    public ResponseEntity<User> getMyProfile(Authentication authentication) {
        try {
            String username = getCurrentUsername(authentication);
            User currentStudent = userStudentService.getCurrentStudent(username);
            return ResponseEntity.ok(currentStudent);
        } catch (Exception e) {
            // User doesn't have student profile yet
            return ResponseEntity.notFound().build();
        }
    }
}
