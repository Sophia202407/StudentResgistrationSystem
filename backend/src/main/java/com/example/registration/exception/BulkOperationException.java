package com.example.registration.exception;

import java.util.List;

public class BulkOperationException extends RuntimeException {
    private final List<String> errors;
    
    public BulkOperationException(String message, List<String> errors) {
        super(message);
        this.errors = errors;
    }
    
    public List<String> getErrors() {
        return errors;
    }
}
