package com.flowcraft.backend.mongodb.security.dto;

import io.swagger.v3.oas.annotations.media.Schema;

import java.util.Base64;

@Schema(description = "Login-Daten für die Authentifizierung")
public record LoginDTO(
    @Schema(
        description = "Benutzername für die Authentifizierung",
        example = "admin"
    )
    String username,

    @Schema(description = "Passwort für die Authentifizierung", example = "p")
    String password
) {

    public void validate() {
        if (username == null || username.isBlank()) {
            throw new IllegalArgumentException("Der Benutzername darf nicht leer sein.");
        }
        if (password == null || password.isBlank()) {
            throw new IllegalArgumentException("Das Passwort darf nicht leer sein.");
        }
    }

    public String encodePassword() {
        return Base64.getEncoder().encodeToString(password.getBytes());
    }
}
