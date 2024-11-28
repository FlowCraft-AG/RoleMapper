package com.flowcraft.backend.mongodb.model.payload;

import com.flowcraft.backend.mongodb.security.enums.ScopeType;
import com.flowcraft.backend.mongodb.security.enums.TokenType;

public record LoginPayload(
    String accessToken,
    int expiresIn,
    int refreshExpiresIn,
    String refreshToken,
    TokenType tokenType,
    int notBeforePolicy,
    String sessionState,
    ScopeType scope
) {

}

