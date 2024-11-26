package com.flowcraft.backend.mongodb.security.enums;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

import java.util.stream.Stream;


public enum ScopeType {
    EMAIL_PROFILE("email profile");

    private final String value;

    ScopeType(final String value) {
        this.value = value;
    }

    @JsonValue
    public String getValue() {
        return value;
    }

    @JsonCreator
    public static ScopeType of(final String value) {
        return Stream.of(values())
            .filter(token -> token.value.equalsIgnoreCase(value))
            .findFirst()
            .orElse(null);
    }
}
