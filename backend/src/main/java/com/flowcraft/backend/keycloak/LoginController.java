package com.flowcraft.backend.keycloak;

import com.flowcraft.backend.mongodb.security.dto.TokenDTO;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;


@RestController
@RequestMapping("/")
@RequiredArgsConstructor
@Slf4j
public class LoginController {

    private final LoginService loginService;

    @PostMapping("login")
    public ResponseEntity<TokenDTO> login(@RequestBody final Login login) {
        final var username = login.username();
        final var password = login.password();

        final var result = loginService.login(username, password);
        log.debug("Login successful for username: {}", username);

        if (result == null) {
            throw new UnauthorizedException("Benutzername oder Passwort sind falsch.");
        }

        return ResponseEntity.ok(result);
    }

    @GetMapping("login")
    public String login() {

        return "Hallo!";
    }

    /**
     * Exception handler for UnauthorizedException.
     *
     * @param ex exception
     * @return ResponseEntity with status code 401 and error message.
     *
     */
    @ExceptionHandler(UnauthorizedException.class)
    public ResponseEntity<String> handleUnauthorizedException(final UnauthorizedException ex) {
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(ex.getMessage());
    }
}
