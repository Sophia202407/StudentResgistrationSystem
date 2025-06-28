package com.example.registration.controller;

import com.example.registration.model.Student;
import com.example.registration.repository.StudentRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDate;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
public class StudentControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private StudentRepository studentRepository;

    @Autowired
    private ObjectMapper objectMapper;

    @BeforeEach
    void setup() {
        studentRepository.deleteAll();
    }

    @Test
    void testAddStudent() throws Exception {
        Student student = new Student();
        student.setName("Alice");
        student.setEmail("alice@example.com");
        student.setEnrollmentDate(LocalDate.now());

        mockMvc.perform(post("/api/students")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(student)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.name").value("Alice"))
                .andExpect(jsonPath("$.email").value("alice@example.com"));
    }

    @Test
    void testUpdateStudent() throws Exception {
        Student student = new Student();
        student.setName("Bob");
        student.setEmail("bob@example.com");
        student.setEnrollmentDate(LocalDate.now());
        student = studentRepository.save(student);

        student.setName("Bobby");
        student.setEmail("bobby@example.com");

        mockMvc.perform(put("/api/students/" + student.getId())
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(student)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name").value("Bobby"))
                .andExpect(jsonPath("$.email").value("bobby@example.com"));
    }
}