package com.flowcraft.backend.mongodb.model.enums;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

import java.util.stream.Stream;

public enum UserType {
    employee("employee"),
    student("student");

    private final String typ;

    UserType(final String typ) {
        this.typ = typ;
    }

    @JsonCreator
    public static UserType of(final String value) {
        if (value == null || value.trim().isEmpty()) {
            throw new IllegalArgumentException("UserType darf nicht null oder leer sein");
        }
        return Stream.of(values())
            .filter(userType -> userType.typ.equalsIgnoreCase(value))
            .findFirst()
            .orElseThrow(() -> new IllegalArgumentException("Ungültiger UserType: " + value));
    }

    @JsonValue
    public String getTyp() {
        return typ;
    }
}

