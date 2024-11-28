package com.flowcraft.backend.mongodb.security.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.flowcraft.backend.mongodb.security.enums.ScopeType;
import com.flowcraft.backend.mongodb.security.enums.TokenType;

public record TokenDTO(
    @JsonProperty("access_token")
    String accessToken,
    @JsonProperty("expires_in")
    int expiresIn,
    @JsonProperty("refresh_expires_in")
    int refreshExpiresIn,
    @JsonProperty("refresh_token")
    String refreshToken,
    @JsonProperty("token_type")
    TokenType tokenType,
    @JsonProperty("not-before-policy")
    int notBeforePolicy,
    @JsonProperty("session_state")
    String sessionState,
    ScopeType scope,
    @JsonProperty("id_token")
    String idToken
) {
}
