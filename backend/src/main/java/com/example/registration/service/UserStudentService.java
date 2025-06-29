package com.example.registration.service;

import com.example.registration.exception.DuplicateStudentException;
import com.example.registration.exception.StudentNotFoundException;
import com.example.registration.model.ERole;
import com.example.registration.model.Role;
import com.example.registration.model.User;
import com.example.registration.payload.request.UpdateUserRequest;
import com.example.registration.repository.RoleRepository;
import com.example.registration.repository.UserRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;

@Service
@Transactional
public class UserStudentService {
    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;

    public UserStudentService(UserRepository userRepository, RoleRepository roleRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.passwordEncoder = passwordEncoder;
    }

    // Get all students (users with full names and enrollment dates)
    @Transactional(readOnly = true)
    public List<User> getAllStudents() {
        return userRepository.findAll(Sort.by(Sort.Direction.DESC, "id"))
                .stream()
                .filter(user -> user.getFullName() != null && user.getEnrollmentDate() != null)
                .toList();
    }

    // Get all students with pagination
    @Transactional(readOnly = true)
    public Page<User> getAllStudents(Pageable pageable) {
        return userRepository.findAll(pageable);
    }

    // Get student by ID
    @Transactional(readOnly = true)
    public User getStudentById(Long id) {
        return userRepository.findById(id)
                .filter(user -> user.getFullName() != null && user.getEnrollmentDate() != null)
                .orElseThrow(() -> new StudentNotFoundException("Student not found with id: " + id));
    }

    // Get current user as student
    @Transactional(readOnly = true)
    public User getCurrentStudent(String username) {
        return userRepository.findByUsername(username)
                .filter(user -> user.getFullName() != null && user.getEnrollmentDate() != null)
                .orElseThrow(() -> new StudentNotFoundException("Student profile not found for user: " + username));
    }

    // Update student profile (self-update)
    public User updateStudentProfile(String username, UpdateUserRequest updatedProfile) {
        User existingUser = userRepository.findByUsername(username)
                .orElseThrow(() -> new StudentNotFoundException("User not found: " + username));

        // Basic validation for required fields
        if (updatedProfile.getUsername() != null && updatedProfile.getUsername().trim().isEmpty()) {
            throw new IllegalArgumentException("Username cannot be empty");
        }
        
        if (updatedProfile.getEmail() != null && updatedProfile.getEmail().trim().isEmpty()) {
            throw new IllegalArgumentException("Email cannot be empty");
        }
        
        if (updatedProfile.getFullName() != null && updatedProfile.getFullName().trim().isEmpty()) {
            throw new IllegalArgumentException("Full name cannot be empty");
        }

        // Update all editable fields for self-update
        if (updatedProfile.getUsername() != null && !updatedProfile.getUsername().trim().isEmpty()) {
            existingUser.setUsername(updatedProfile.getUsername().trim());
        }
        
        if (updatedProfile.getEmail() != null && !updatedProfile.getEmail().trim().isEmpty()) {
            existingUser.setEmail(updatedProfile.getEmail().trim());
        }
        
        if (updatedProfile.getFullName() != null && !updatedProfile.getFullName().trim().isEmpty()) {
            existingUser.setFullName(updatedProfile.getFullName().trim());
        }
        
        if (updatedProfile.getEnrollmentDate() != null) {
            existingUser.setEnrollmentDate(updatedProfile.getEnrollmentDate());
        }
        
        // Update password if provided
        if (updatedProfile.getPassword() != null && !updatedProfile.getPassword().trim().isEmpty()) {
            if (updatedProfile.getPassword().trim().length() < 6) {
                throw new IllegalArgumentException("Password must be at least 6 characters long");
            }
            existingUser.setPassword(passwordEncoder.encode(updatedProfile.getPassword().trim()));
        }
        
        return userRepository.save(existingUser);
    }

    // Update any student (admin/moderator only)
    public User updateStudent(Long id, UpdateUserRequest updatedProfile) {
        User existingUser = userRepository.findById(id)
                .orElseThrow(() -> new StudentNotFoundException("Student not found with id: " + id));

        // Basic validation for required fields
        if (updatedProfile.getUsername() != null && updatedProfile.getUsername().trim().isEmpty()) {
            throw new IllegalArgumentException("Username cannot be empty");
        }
        
        if (updatedProfile.getEmail() != null && updatedProfile.getEmail().trim().isEmpty()) {
            throw new IllegalArgumentException("Email cannot be empty");
        }
        
        if (updatedProfile.getFullName() != null && updatedProfile.getFullName().trim().isEmpty()) {
            throw new IllegalArgumentException("Full name cannot be empty");
        }

        // Update all editable fields
        if (updatedProfile.getUsername() != null && !updatedProfile.getUsername().trim().isEmpty()) {
            existingUser.setUsername(updatedProfile.getUsername().trim());
        }
        
        if (updatedProfile.getEmail() != null && !updatedProfile.getEmail().trim().isEmpty()) {
            existingUser.setEmail(updatedProfile.getEmail().trim());
        }
        
        if (updatedProfile.getFullName() != null && !updatedProfile.getFullName().trim().isEmpty()) {
            existingUser.setFullName(updatedProfile.getFullName().trim());
        }
        
        if (updatedProfile.getEnrollmentDate() != null) {
            existingUser.setEnrollmentDate(updatedProfile.getEnrollmentDate());
        }
        
        // Update password if provided (admin/moderator can reset passwords)
        if (updatedProfile.getPassword() != null && !updatedProfile.getPassword().trim().isEmpty()) {
            if (updatedProfile.getPassword().trim().length() < 6) {
                throw new IllegalArgumentException("Password must be at least 6 characters long");
            }
            existingUser.setPassword(passwordEncoder.encode(updatedProfile.getPassword().trim()));
        }
        
        return userRepository.save(existingUser);
    }

    // Update student with roles (admin only)
    public User updateStudentWithRoles(Long id, UpdateUserRequest updatedProfile, List<String> roleStrings) {
        User existingUser = userRepository.findById(id)
                .orElseThrow(() -> new StudentNotFoundException("Student not found with id: " + id));

        // Basic validation for required fields
        if (updatedProfile.getUsername() != null && updatedProfile.getUsername().trim().isEmpty()) {
            throw new IllegalArgumentException("Username cannot be empty");
        }
        
        if (updatedProfile.getEmail() != null && updatedProfile.getEmail().trim().isEmpty()) {
            throw new IllegalArgumentException("Email cannot be empty");
        }
        
        if (updatedProfile.getFullName() != null && updatedProfile.getFullName().trim().isEmpty()) {
            throw new IllegalArgumentException("Full name cannot be empty");
        }

        // Update all editable fields
        if (updatedProfile.getUsername() != null && !updatedProfile.getUsername().trim().isEmpty()) {
            existingUser.setUsername(updatedProfile.getUsername().trim());
        }
        
        if (updatedProfile.getEmail() != null && !updatedProfile.getEmail().trim().isEmpty()) {
            existingUser.setEmail(updatedProfile.getEmail().trim());
        }
        
        if (updatedProfile.getFullName() != null && !updatedProfile.getFullName().trim().isEmpty()) {
            existingUser.setFullName(updatedProfile.getFullName().trim());
        }
        
        if (updatedProfile.getEnrollmentDate() != null) {
            existingUser.setEnrollmentDate(updatedProfile.getEnrollmentDate());
        }

        // Update password if provided (admin can reset passwords)
        if (updatedProfile.getPassword() != null && !updatedProfile.getPassword().trim().isEmpty()) {
            if (updatedProfile.getPassword().trim().length() < 6) {
                throw new IllegalArgumentException("Password must be at least 6 characters long");
            }
            existingUser.setPassword(passwordEncoder.encode(updatedProfile.getPassword().trim()));
        }

        // Update roles if provided (including empty array to remove all roles)
        if (roleStrings != null) {
            if (roleStrings.isEmpty()) {
                // Admin wants to remove all roles
                existingUser.setRoles(new HashSet<>());
            } else {
                // Admin wants to set specific roles
                Set<Role> roles = convertStringRolesToRoles(roleStrings);
                existingUser.setRoles(roles);
            }
        }
        
        return userRepository.save(existingUser);
    }

    // Delete student (admin/moderator only)
    public void deleteStudent(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new StudentNotFoundException("Student not found with id: " + id));
        
        userRepository.delete(user);
    }

    // Complete student profile (add student info to existing user)
    public User completeStudentProfile(String username, String fullName, java.time.LocalDate enrollmentDate) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new StudentNotFoundException("User not found: " + username));

        user.setFullName(fullName);
        user.setEnrollmentDate(enrollmentDate);
        
        return userRepository.save(user);
    }

    // Search students by name or email
    @Transactional(readOnly = true)
    public List<User> searchStudents(String keyword) {
        return userRepository.findAll()
                .stream()
                .filter(user -> user.getFullName() != null && user.getEnrollmentDate() != null)
                .filter(user -> 
                    user.getFullName().toLowerCase().contains(keyword.toLowerCase()) ||
                    user.getEmail().toLowerCase().contains(keyword.toLowerCase()) ||
                    user.getUsername().toLowerCase().contains(keyword.toLowerCase())
                )
                .toList();
    }

    // Helper method to convert role strings to Role entities
    private Set<Role> convertStringRolesToRoles(List<String> roleStrings) {
        Set<Role> roles = new HashSet<>();
        
        if (roleStrings != null) {
            for (String roleString : roleStrings) {
                try {
                    // Handle both "ROLE_USER" and "USER" formats by ensuring ROLE_ prefix
                    String normalizedRoleName = roleString.startsWith("ROLE_") ? 
                        roleString : "ROLE_" + roleString;
                    
                    ERole eRole = ERole.valueOf(normalizedRoleName);
                    Optional<Role> role = roleRepository.findByName(eRole);
                    role.ifPresent(roles::add);
                } catch (IllegalArgumentException e) {
                    // Invalid role name, skip it
                    System.err.println("Invalid role name: " + roleString);
                }
            }
        }
        
        return roles;
    }
}
