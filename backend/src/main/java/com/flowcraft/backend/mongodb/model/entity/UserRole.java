package com.flowcraft.backend.mongodb.model.entity;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

import java.util.stream.Stream;

public enum UserRole {
    LECTURER("lecturer"),
    ADMIN_TECHNICAL_STAFF("adminTechnicalStaff"),
    ACADEMIC_STAFF("academicStaff"),
    EMPTY("-"),
    PROFESSOR("professor");

    private final String role;

    UserRole(final String role) {
        this.role = role;
    }

    @JsonCreator
    public static UserRole of(final String value) {
        return Stream.of(values())
            .filter(userRole -> userRole.role.equalsIgnoreCase(value))
            .findFirst()
            .orElseThrow(() -> new IllegalArgumentException("Ungültiger UserRole: " + value));
    }

    @JsonValue
    public String getRole() {
        return role;
    }
}
