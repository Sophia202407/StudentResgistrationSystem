package com.example.registration.controller;

import com.example.registration.model.Student;
import com.example.registration.service.StudentService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDate;
import java.util.Arrays;
import java.util.List;

import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(StudentController.class)
class StudentControllerEnhancedTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private StudentService studentService;

    @Autowired
    private ObjectMapper objectMapper;

    private Student testStudent;
    private List<Student> testStudents;

    @BeforeEach
    void setUp() {
        testStudent = new Student("John Doe", "john.doe@example.com", LocalDate.of(2025, 1, 15));
        testStudent.setId(1L);

        Student student2 = new Student("Jane Smith", "jane.smith@example.com", LocalDate.of(2025, 1, 20));
        student2.setId(2L);

        testStudents = Arrays.asList(testStudent, student2);
    }

    @Test
    void testGetAllStudents() throws Exception {
        when(studentService.getAllStudents()).thenReturn(testStudents);

        mockMvc.perform(get("/api/students"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(2))
                .andExpect(jsonPath("$[0].name").value("John Doe"))
                .andExpect(jsonPath("$[1].name").value("Jane Smith"));
    }

    @Test
    void testGetStudentById() throws Exception {
        when(studentService.getStudentById(1L)).thenReturn(testStudent);

        mockMvc.perform(get("/api/students/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name").value("John Doe"))
                .andExpect(jsonPath("$.email").value("john.doe@example.com"));
    }

    @Test
    void testAddStudent() throws Exception {
        when(studentService.addStudent(any(Student.class))).thenReturn(testStudent);

        mockMvc.perform(post("/api/students")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(testStudent)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.name").value("John Doe"));
    }

    @Test
    void testUpdateStudent() throws Exception {
        when(studentService.updateStudent(eq(1L), any(Student.class))).thenReturn(testStudent);

        mockMvc.perform(put("/api/students/1")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(testStudent)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name").value("John Doe"));
    }

    @Test
    void testDeleteStudent() throws Exception {
        doNothing().when(studentService).deleteStudent(1L);

        mockMvc.perform(delete("/api/students/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("Student deleted successfully"))
                .andExpect(jsonPath("$.deletedId").value("1"));
    }

    @Test
    void testSearchStudents() throws Exception {
        when(studentService.searchStudents("John")).thenReturn(Arrays.asList(testStudent));

        mockMvc.perform(get("/api/students/search")
                .param("keyword", "John"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(1))
                .andExpect(jsonPath("$[0].name").value("John Doe"));
    }

    @Test
    void testGetStudentCount() throws Exception {
        when(studentService.getTotalStudentCount()).thenReturn(2L);

        mockMvc.perform(get("/api/students/count"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.totalCount").value(2));
    }

    @Test
    void testCheckEmailExists() throws Exception {
        when(studentService.existsByEmail("john.doe@example.com")).thenReturn(true);

        mockMvc.perform(get("/api/students/exists/email/john.doe@example.com"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.exists").value(true));
    }
}
