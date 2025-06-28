package com.example.registration.model;

import com.fasterxml.jackson.annotation.JsonFormat;

import javax.persistence.*;
import javax.validation.constraints.*;
import java.time.LocalDate;

@Entity
@Table(name = "student", uniqueConstraints = @UniqueConstraint(columnNames = "email"))
public class Student {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Name is required")
    @Size(min = 2, max = 100, message = "Name must be between 2 and 100 characters")
    @Column(nullable = false)
    private String name;

    @NotBlank(message = "Email is required")
    @Email(message = "Email should be valid")
    @Size(max = 150, message = "Email must not exceed 150 characters")
    @Column(nullable = false, unique = true)
    private String email;

    @NotNull(message = "Enrollment date is required")
    @PastOrPresent(message = "Enrollment date cannot be in the future")
    @JsonFormat(pattern = "yyyy-MM-dd")
    @Column(name = "enrollment_date", nullable = false)
    private LocalDate enrollmentDate;

    // Default constructor
    public Student() {}

    // Constructor with parameters
    public Student(String name, String email, LocalDate enrollmentDate) {
        this.name = name;
        this.email = email;
        this.enrollmentDate = enrollmentDate;
    }

    // Getters and setters
    public Long getId() { 
        return id; 
    }
    
    public void setId(Long id) { 
        this.id = id; 
    }

    public String getName() { 
        return name; 
    }
    
    public void setName(String name) { 
        this.name = name != null ? name.trim() : null; 
    }

    public String getEmail() { 
        return email; 
    }
    
    public void setEmail(String email) { 
        this.email = email != null ? email.trim().toLowerCase() : null; 
    }

    public LocalDate getEnrollmentDate() { 
        return enrollmentDate; 
    }
    
    public void setEnrollmentDate(LocalDate enrollmentDate) { 
        this.enrollmentDate = enrollmentDate; 
    }

    // toString method for debugging
    @Override
    public String toString() {
        return "Student{" +
                "id=" + id +
                ", name='" + name + '\'' +
                ", email='" + email + '\'' +
                ", enrollmentDate=" + enrollmentDate +
                '}';
    }

    // equals and hashCode methods
    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Student student = (Student) o;
        return id != null && id.equals(student.id);
    }

    @Override
    public int hashCode() {
        return getClass().hashCode();
    }
}