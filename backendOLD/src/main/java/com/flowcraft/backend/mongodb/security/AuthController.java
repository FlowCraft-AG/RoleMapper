package com.flowcraft.backend.mongodb.security;

import com.flowcraft.backend.KeycloakProps;
import com.flowcraft.backend.mongodb.model.dto.LoginDTO;
import com.flowcraft.backend.mongodb.security.dto.TokenDTO;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.password.CompromisedPasswordChecker;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.HttpClientErrorException;

import java.nio.charset.Charset;
import java.util.Base64;
import java.util.Map;

import static org.springframework.http.HttpStatus.UNAUTHORIZED;
import static org.springframework.http.MediaType.APPLICATION_FORM_URLENCODED_VALUE;
import static org.springframework.http.MediaType.APPLICATION_JSON_VALUE;

@RestController
@RequestMapping(AuthController.AUTH_PATH)
@RequiredArgsConstructor
@Slf4j
public class AuthController {
    public static final String AUTH_PATH = "/auth";

    private final KeycloakRepository keycloakRepository;
    private final CompromisedPasswordChecker passwordChecker;

    private final KeycloakProps keycloakProps;

    private String clientAndSecretEncoded;

    @PostConstruct
    private void encodeClientAndSecret() {
        final var clientAndSecret =String.format("%s:%s", keycloakProps.clientId(), keycloakProps.clientSecret());
        clientAndSecretEncoded = Base64
            .getEncoder()
            .encodeToString(clientAndSecret.getBytes(Charset.defaultCharset()));
    }

    @Operation(summary = "Benutzerdetails abrufen", description = "Liefert Informationen über den aktuell angemeldeten Benutzer.")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Benutzerinformationen erfolgreich abgerufen"),
        @ApiResponse(responseCode = "401", description = "Nicht autorisiert")
    })
    @GetMapping("/me")
    Map<String, Object> me(@AuthenticationPrincipal final Jwt jwt) {
        log.info("me: isCompromised() bei Passwort 'pass1234': {}", passwordChecker.check("pass1234").isCompromised());

        return Map.of(
            "subject", jwt.getSubject(),
            "claims", jwt.getClaims()
        );
    }

    @Operation(summary = "Benutzer anmelden", description = "Authentifiziert einen Benutzer mit Benutzername und Passwort.")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Anmeldung erfolgreich"),
        @ApiResponse(responseCode = "401", description = "Ungültige Anmeldeinformationen")
    })
    @PostMapping(path = "/login", consumes = APPLICATION_JSON_VALUE)
    TokenDTO login(
        @RequestBody final LoginDTO loginDto
    ) {
        log.debug("login: loginDto={}", loginDto);
        final var tokenDTO = keycloakRepository.login(
            String.format("grant_type=password&username=%s&password=%s", loginDto.username(), loginDto.password()),
            String.format("Basic %s", clientAndSecretEncoded),
            APPLICATION_FORM_URLENCODED_VALUE
        );
        log.debug("login: tokenDTO={}", tokenDTO);
        return tokenDTO;
    }

    @ExceptionHandler
    @ResponseStatus(UNAUTHORIZED)
    void onUnauthorized(final HttpClientErrorException.Unauthorized ex) {
    }

    @ExceptionHandler(Exception.class)
    @ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
    public ResponseEntity<String> handleGeneralException(Exception ex) {
        log.error("Ein unerwarteter Fehler ist aufgetreten: {}", ex.getMessage());
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Ein unerwarteter Fehler ist aufgetreten.");
    }
}
