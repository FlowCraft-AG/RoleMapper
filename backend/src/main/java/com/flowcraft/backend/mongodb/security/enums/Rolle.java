package com.flowcraft.backend.mongodb.security.enums;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;
import lombok.Getter;
import lombok.RequiredArgsConstructor;

import java.util.stream.Stream;

@Getter
@RequiredArgsConstructor
public enum Rolle {
    ADMIN("admin"),
    USER("user");

    private final String role;

    @JsonCreator
    public static Rolle of(final String str) {
        return Stream.of(values())
            .filter(rolle -> rolle.name().equalsIgnoreCase(str))
            .findFirst()
            .orElse(null);
    }

    @JsonValue
    public String getRole() {
        return role;
    }
}
