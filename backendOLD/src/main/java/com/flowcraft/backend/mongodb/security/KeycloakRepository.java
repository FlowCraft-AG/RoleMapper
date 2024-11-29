package com.flowcraft.backend.mongodb.security;

import com.flowcraft.backend.mongodb.security.dto.TokenDTO;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.service.annotation.GetExchange;
import org.springframework.web.service.annotation.HttpExchange;
import org.springframework.web.service.annotation.PostExchange;

import java.util.Map;

import static org.springframework.http.HttpHeaders.AUTHORIZATION;
import static org.springframework.http.HttpHeaders.CONTENT_TYPE;

@HttpExchange
public interface KeycloakRepository {

    @GetExchange("/realms/flowcraft/.well-known/openid-configuration")
    Map<String, Object> openidConfiguration();

    @PostExchange("/realms/flowcraft/protocol/openid-connect/token")
    TokenDTO login(
        @RequestBody String loginData,
        @RequestHeader(AUTHORIZATION) String authorization,
        @RequestHeader(CONTENT_TYPE) String contentType
    );
}
