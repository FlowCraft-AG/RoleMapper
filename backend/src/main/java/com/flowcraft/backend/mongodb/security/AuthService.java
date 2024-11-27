package com.flowcraft.backend.mongodb.security;

import com.flowcraft.backend.KeycloakProps;
import com.flowcraft.backend.mongodb.security.dto.TokenDTO;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.nio.charset.Charset;
import java.util.Base64;

import static org.springframework.http.MediaType.APPLICATION_FORM_URLENCODED_VALUE;

@Service
@RequiredArgsConstructor
@Slf4j
public class AuthService {
    private final KeycloakRepository keycloakRepository;
    private final KeycloakProps keycloakProps;
    private String clientAndSecretEncoded;

    @PostConstruct
    private void encodeClientAndSecret() {
        final var clientAndSecret = keycloakProps.clientId() + ':' + keycloakProps.clientSecret();
        clientAndSecretEncoded = Base64
            .getEncoder()
            .encodeToString(clientAndSecret.getBytes(Charset.defaultCharset()));
    }

    /**
     * login funktion zum Anmelden.
     *
     * @param username username des benutzers.
     *
     * @return accessToken und etc...
     */
    public TokenDTO login(final String username, final String password) {
        log.debug("login: username={}", username);

        final var tokenDTO = keycloakRepository.login(
            String.format("grant_type=password&username=%s&password=%s&client_id=%s&client_secret%s",
                username,
                password,
                keycloakProps.clientId(),
                keycloakProps.clientSecret()
            ),
            String.format("Basic %s", clientAndSecretEncoded),
            APPLICATION_FORM_URLENCODED_VALUE
        );

        log.debug(String.format("token: %s", tokenDTO));
        return tokenDTO;
    }
}
