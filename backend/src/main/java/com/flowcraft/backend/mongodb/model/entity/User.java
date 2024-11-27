package com.flowcraft.backend.mongodb.model.entity;

import com.flowcraft.backend.mongodb.model.enums.UserType;
import jakarta.validation.constraints.NotNull;
import lombok.*;
import org.springframework.data.annotation.*;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Document(collection = "HKA_Users_Orig")
@Getter
@Setter
@ToString
@NoArgsConstructor
@AllArgsConstructor
public class User {

    @Id
    private String id;

    @NotNull
    @Indexed(unique = true)
    private String userId;

    @NotNull
    private UserType userType;

    @NotNull
    private String userRole;

    @Indexed
    private String orgUnit;

    @Indexed
    private boolean active;

    private Student student;
    private Employee employee;

    private LocalDateTime validFrom;
    private LocalDateTime validUntil;

    @CreatedDate
    private LocalDateTime createdAt;

    @LastModifiedDate
    private LocalDateTime updatedAt;

    /**
     * Prüft, ob der Benutzer aktuell gültig ist.
     *
     * @return true, wenn der Benutzer gültig ist; false sonst.
     */
    public boolean isValidNow() {
        LocalDateTime now = LocalDateTime.now();
        return (validFrom == null || !now.isBefore(validFrom)) &&
            (validUntil == null || !now.isAfter(validUntil));
    }
}
