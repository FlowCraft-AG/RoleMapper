package com.flowcraft.backend.mongodb.exception;

import lombok.Getter;

@Getter
public class UserNotFoundException extends RuntimeException {
    private final String user;

    public UserNotFoundException(final String user) {
        super(String.format("UserId %s existiert nicht", user));
        this.user = user;
    }
}
