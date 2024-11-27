package com.flowcraft.backend.mongodb.resolver;

import com.flowcraft.backend.mongodb.model.dto.LoginDTO;
import com.flowcraft.backend.mongodb.model.payload.LoginPayload;
import com.flowcraft.backend.mongodb.security.AuthService;
import com.flowcraft.backend.mongodb.security.KeycloakRepository;
import com.flowcraft.backend.mongodb.security.dto.TokenDTO;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.graphql.data.method.annotation.Argument;
import org.springframework.graphql.data.method.annotation.MutationMapping;
import org.springframework.graphql.data.method.annotation.QueryMapping;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Controller;

import java.util.List;

import static org.springframework.http.MediaType.APPLICATION_FORM_URLENCODED_VALUE;

@Controller
@RequiredArgsConstructor
@Slf4j
public class Mutation {
    private final AuthService authService;

    @MutationMapping("login")
    public TokenDTO login(@Argument String username, @Argument String password) {
        log.debug("login: username = {}", username);

        final var tokenData = authService.login(username, password);
        log.debug("login: tokenData={}", tokenData);
        return tokenData;
    }
}
