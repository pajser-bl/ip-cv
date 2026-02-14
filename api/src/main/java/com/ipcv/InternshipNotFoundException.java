package com.ipcv;

public class InternshipNotFoundException extends RuntimeException {
    public InternshipNotFoundException(Long id) {
        super("Internship not found: " + id);
    }
}
