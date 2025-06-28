package com.example.registration.exception;

import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.method.annotation.MethodArgumentTypeMismatchException;

import javax.validation.ConstraintViolationException;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(StudentNotFoundException.class)
    public ResponseEntity<Map<String, Object>> handleNotFound(StudentNotFoundException ex) {
        return createErrorResponse(HttpStatus.NOT_FOUND, "Student Not Found", ex.getMessage());
    }

    @ExceptionHandler(DuplicateStudentException.class)
    public ResponseEntity<Map<String, Object>> handleDuplicate(DuplicateStudentException ex) {
        return createErrorResponse(HttpStatus.CONFLICT, "Duplicate Student", ex.getMessage());
    }

    @ExceptionHandler(InvalidStudentDataException.class)
    public ResponseEntity<Map<String, Object>> handleInvalidData(InvalidStudentDataException ex) {
        return createErrorResponse(HttpStatus.BAD_REQUEST, "Invalid Student Data", ex.getMessage());
    }

    @ExceptionHandler(BulkOperationException.class)
    public ResponseEntity<Map<String, Object>> handleBulkOperation(BulkOperationException ex) {
        Map<String, Object> errorResponse = createErrorMap(HttpStatus.BAD_REQUEST, "Bulk Operation Failed", ex.getMessage());
        errorResponse.put("errors", ex.getErrors());
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorResponse);
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, Object>> handleValidation(MethodArgumentNotValidException ex) {
        List<String> errors = ex.getBindingResult()
                .getFieldErrors()
                .stream()
                .map(error -> error.getField() + ": " + error.getDefaultMessage())
                .collect(Collectors.toList());
        
        Map<String, Object> errorResponse = createErrorMap(HttpStatus.BAD_REQUEST, "Validation Failed", "Invalid input data");
        errorResponse.put("validationErrors", errors);
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorResponse);
    }

    @ExceptionHandler(ConstraintViolationException.class)
    public ResponseEntity<Map<String, Object>> handleConstraintViolation(ConstraintViolationException ex) {
        List<String> errors = ex.getConstraintViolations()
                .stream()
                .map(violation -> violation.getPropertyPath() + ": " + violation.getMessage())
                .collect(Collectors.toList());
        
        Map<String, Object> errorResponse = createErrorMap(HttpStatus.BAD_REQUEST, "Constraint Violation", "Data validation failed");
        errorResponse.put("constraintErrors", errors);
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorResponse);
    }

    @ExceptionHandler(MethodArgumentTypeMismatchException.class)
    public ResponseEntity<Map<String, Object>> handleTypeMismatch(MethodArgumentTypeMismatchException ex) {
        String message = String.format("Invalid value '%s' for parameter '%s'. Expected type: %s", 
            ex.getValue(), ex.getName(), ex.getRequiredType().getSimpleName());
        return createErrorResponse(HttpStatus.BAD_REQUEST, "Type Mismatch", message);
    }

    @ExceptionHandler(DataIntegrityViolationException.class)
    public ResponseEntity<Map<String, Object>> handleDataIntegrity(DataIntegrityViolationException ex) {
        String message = "Database constraint violation. This might be due to duplicate data or invalid references.";
        if (ex.getMessage().contains("email")) {
            message = "A student with this email address already exists.";
        }
        return createErrorResponse(HttpStatus.CONFLICT, "Data Integrity Error", message);
    }

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<Map<String, Object>> handleIllegalArgument(IllegalArgumentException ex) {
        return createErrorResponse(HttpStatus.BAD_REQUEST, "Invalid Argument", ex.getMessage());
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<Map<String, Object>> handleGeneral(Exception ex) {
        return createErrorResponse(HttpStatus.INTERNAL_SERVER_ERROR, "Internal Server Error", 
            "An unexpected error occurred. Please try again later.");
    }

    // Helper methods
    private ResponseEntity<Map<String, Object>> createErrorResponse(HttpStatus status, String error, String message) {
        Map<String, Object> errorResponse = createErrorMap(status, error, message);
        return ResponseEntity.status(status).body(errorResponse);
    }

    private Map<String, Object> createErrorMap(HttpStatus status, String error, String message) {
        Map<String, Object> errorResponse = new HashMap<>();
        errorResponse.put("timestamp", LocalDateTime.now());
        errorResponse.put("status", status.value());
        errorResponse.put("error", error);
        errorResponse.put("message", message);
        errorResponse.put("path", getCurrentPath());
        return errorResponse;
    }

    private String getCurrentPath() {
        // This is a simplified approach. In a real application, you might want to get the actual request path
        return "/api/students";
    }
}