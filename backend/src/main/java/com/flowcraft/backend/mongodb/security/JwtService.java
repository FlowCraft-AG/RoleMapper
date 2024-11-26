
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
    public String getUsername(final Jwt jwt) {
        log.debug("getUsername");
        if (jwt == null) {
            throw new UserNotFoundException();
        }
        final var username = (String) jwt.getClaims().get("preferred_username");
        log.debug("getUsername: username={}", username);
        return username;
    }

    public List<Rolle> getRollen(final Jwt jwt) {
        @SuppressWarnings("unchecked")
        final var resourceAccess = (Map<String, List<String>>) jwt.getClaims().get("resource_access");
        log.debug("getRollen: resourceAccess={}", resourceAccess);
        @SuppressWarnings("unchecked")
        final var roleMapper = (Map<String, List<String>>) resourceAccess.get("rolemapper");
        log.debug("getRollen: roleMapper={}", roleMapper);
        final var rollenStr = roleMapper.get("roles");
        log.trace("getRollen: rollenStr={}", rollenStr);
        return rollenStr
            .stream()
            .map(Rolle::of)
            .filter(Objects::nonNull)
            .toList();
    }
}
