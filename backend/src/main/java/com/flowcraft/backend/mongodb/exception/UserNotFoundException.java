package com.flowcraft.backend.mongodb.exception;

import lombok.Getter;

import java.io.Serial;
import java.io.Serializable;

/**
 * Exception, die ausgelöst wird, wenn ein Benutzer nicht gefunden wird.
 */
@Getter
public class UserNotFoundException extends RuntimeException implements Serializable {
    @Serial
    private static final long serialVersionUID = 1L;

    private final String userId;

    /**
     * Konstruktor mit spezifischer Benutzer-ID.
     *
     * @param userId Die Benutzer-ID, die nicht gefunden wurde.
     */
    public UserNotFoundException(final String userId) {
        super(String.format("UserId %s existiert nicht", userId));
        this.userId = userId;
    }

    /**
     * Konstruktor für einen allgemeinen "Benutzer nicht gefunden"-Fall.
     */
    public UserNotFoundException() {
        super("Keine User gefunden.");
        this.userId = null;
    }

    /**
     * Konstruktor mit Benutzer-ID und einer tiefergehenden Ursache.
     *
     * @param userId Die Benutzer-ID, die nicht gefunden wurde.
     * @param cause  Die zugrunde liegende Ursache der Exception.
     */
    public UserNotFoundException(final String userId, final Throwable cause) {
        super(String.format("UserId %s existiert nicht", userId), cause);
        this.userId = userId;
    }
}
