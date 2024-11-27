package com.flowcraft.backend.mongodb.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

/**
 * Javadoc-Kommentar für die UnauthorizedException-Klasse.
 */
@ResponseStatus(HttpStatus.UNAUTHORIZED)
public class UnauthorizedException extends RuntimeException {

    /**
     * Konstruktor für UnauthorizedException.
     *
     * @param message Fehlermeldung der Ausnahme.
     */
    public UnauthorizedException(final String message) {
        super(message);
    }
}
