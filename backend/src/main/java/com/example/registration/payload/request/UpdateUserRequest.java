package com.example.registration.payload.request;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Data;

import java.time.LocalDate;
import java.util.List;

@Data
public class UpdateUserRequest {
    private Long id;
    private String username;
    private String email;
    private String fullName;
    private String password; // Optional field for password updates
    
    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate enrollmentDate;
    
    private List<String> roles;
    private String createdAt;
}
