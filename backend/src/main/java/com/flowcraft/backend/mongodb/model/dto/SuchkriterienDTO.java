package com.flowcraft.backend.mongodb.model.dto;

import io.swagger.v3.oas.annotations.media.Schema;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * DTO zum Übertragen von Suchkriterien für Benutzerabfragen.
 */
@Schema(description = "Suchkriterien für Benutzerabfragen")
public record SuchkriterienDTO(
    @Schema(description = "Der Benutzertyp, z. B. 'student' oder 'employee'", example = "employee")
    String userType,

    @Schema(description = "Die Benutzerrolle, z. B. 'admin' oder 'user'", example = "lecturer")
    String userRole,

    @Schema(description = "Ob der Benutzer aktiv ist", example = "true")
    Boolean active,

    @Schema(description = "Die Organisationseinheit des Benutzers", example = "A0004")
    String orgUnit
) {

    /**
     * Konvertiert die Suchkriterien in eine einfache Map mit String-Werten.
     *
     * @return Eine unveränderliche Map der Suchkriterien.
     */
    public Map<String, String> toMap() {
        final Map<String, String> map = new HashMap<>();
        if (userType != null) map.put("userType", userType);
        if (userRole != null) map.put("userRole", userRole);
        if (active != null) map.put("active", active.toString());
        if (orgUnit != null) map.put("orgUnit", orgUnit);
        return Map.copyOf(map);
    }

    /**
     * Konvertiert die Suchkriterien in eine Multi-Value-Map.
     *
     * @return Eine unveränderliche Multi-Value-Map der Suchkriterien.
     */
    public Map<String, List<String>> toMultiValueMap() {
        final Map<String, List<String>> map = new HashMap<>();
        if (userType != null) map.put("userType", List.of(userType));
        if (userRole != null) map.put("userRole", List.of(userRole));
        if (active != null) map.put("active", List.of(active.toString()));
        if (orgUnit != null) map.put("orgUnit", List.of(orgUnit));
        return Map.copyOf(map);
    }

    /**
     * Validiert die Suchkriterien.
     *
     * @throws IllegalArgumentException Wenn eines der Kriterien ungültig ist.
     */
    public void validate() {
        if (userType != null && !List.of("student", "employee").contains(userType.toLowerCase())) {
            throw new IllegalArgumentException("Ungültiger Benutzertyp: " + userType);
        }
        if (userRole != null && !List.of("admin", "user").contains(userRole.toLowerCase())) {
            throw new IllegalArgumentException("Ungültige Benutzerrolle: " + userRole);
        }
    }
}
