package com.flowcraft.backend.mongodb.model;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonPropertyOrder;
import com.flowcraft.backend.mongodb.model.entity.User;
import com.flowcraft.backend.mongodb.model.enums.UserType;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Getter;
import lombok.ToString;
import org.springframework.hateoas.RepresentationModel;

import java.time.LocalDateTime;

@JsonInclude(JsonInclude.Include.NON_NULL)
@JsonPropertyOrder({
    "id", "userId", "userType", "userRole", "orgUnit", "active",
    "validFrom", "validUntil"
})
@Getter
@ToString(callSuper = true)
@Schema(description = "Repräsentiert ein grundlegendes Benutzer-Modell mit HATEOAS-Unterstützung.")
public class BaseUserModel extends RepresentationModel<BaseUserModel> {

    @Schema(description = "Eindeutige ID des Benutzers.")
    private final String id;

    @Schema(description = "Eindeutige Benutzerkennung.")
    private final String userId;

    @Schema(description = "Benutzertyp.")
    private final UserType userType;

    @Schema(description = "Benutzerrolle.")
    private final String userRole;

    @Schema(description = "Organisationseinheit des Benutzers.")
    private final String orgUnit;

    @Schema(description = "Aktivstatus des Benutzers.")
    private final boolean active;

    @Schema(description = "Startdatum der Gültigkeit.")
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private final LocalDateTime validFrom;

    @Schema(description = "Enddatum der Gültigkeit.")
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private final LocalDateTime validUntil;

    /**
     * Konstruktor, der ein Benutzerobjekt akzeptiert.
     *
     * @param user Das Benutzer-Entity, aus dem die Felder übernommen werden.
     * @throws IllegalArgumentException falls das Benutzerobjekt null ist.
     */
    public BaseUserModel(final User user) {
        if (user == null) {
            throw new IllegalArgumentException("User cannot be null");
        }
        this.id = user.getId();
        this.userId = user.getUserId();
        this.userType = user.getUserType();
        this.userRole = user.getUserRole();
        this.orgUnit = user.getOrgUnit();
        this.active = user.isActive();
        this.validFrom = user.getValidFrom();
        this.validUntil = user.getValidUntil();
    }
}
