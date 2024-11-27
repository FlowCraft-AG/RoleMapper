package com.flowcraft.backend.mongodb.security;

import com.flowcraft.backend.mongodb.exception.UserNotFoundException;
import com.flowcraft.backend.mongodb.security.enums.Rolle;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.Objects;

@Service
@Slf4j
@SuppressWarnings("java:S5852")
public class JwtService {

    private static final String CLAIM_PREFERRED_USERNAME = "preferred_username";
    private static final String CLAIM_RESOURCE_ACCESS = "resource_access";
    private static final String CLAIM_ROLEMAPPER = "rolemapper";
    private static final String CLAIM_ROLES = "roles";

    /**
     * Liefert den Benutzernamen aus dem JWT.
     *
     * @param jwt Das JWT-Token.
     * @return Der Benutzername.
     * @throws UserNotFoundException Wenn das JWT oder der Benutzername nicht vorhanden ist.
     */
    public String getUsername(final Jwt jwt) {
        log.debug("getUsername");
        if (jwt == null || jwt.getClaims() == null) {
            throw new UserNotFoundException("JWT oder Claims fehlen.");
        }

        final var username = (String) jwt.getClaims().get(CLAIM_PREFERRED_USERNAME);
        if (username == null) {
            throw new UserNotFoundException("Kein Benutzername im JWT gefunden.");
        }

        log.debug("getUsername: username={}****", username.substring(0, Math.min(3, username.length())));
        return username;
    }

    /**
     * Liefert die Rollen aus dem JWT.
     *
     * @param jwt Das JWT-Token.
     * @return Eine Liste von Rollen.
     */
    public List<Rolle> getRollen(final Jwt jwt) {
        if (jwt == null || jwt.getClaims() == null) {
            log.warn("getRollen: JWT oder Claims fehlen.");
            return List.of();
        }

        @SuppressWarnings("unchecked")
        final var resourceAccess = (Map<String, Map<String, List<String>>>) jwt.getClaims().get(CLAIM_RESOURCE_ACCESS);
        if (resourceAccess == null || !resourceAccess.containsKey(CLAIM_ROLEMAPPER)) {
            log.warn("getRollen: Keine Rollen gefunden im Claim '{}'", CLAIM_RESOURCE_ACCESS);
            return List.of();
        }

        final var roleMapper = resourceAccess.get(CLAIM_ROLEMAPPER);
        final var rollenStr = roleMapper != null ? roleMapper.get(CLAIM_ROLES) : null;

        if (rollenStr == null || rollenStr.isEmpty()) {
            log.warn("getRollen: Rollen-Claim '{}' ist leer.", CLAIM_ROLES);
            return List.of();
        }

        log.trace("getRollen: rollenStr={}", rollenStr);

        return rollenStr.stream()
            .map(Rolle::of)
            .filter(Objects::nonNull)
            .toList();
    }
}
