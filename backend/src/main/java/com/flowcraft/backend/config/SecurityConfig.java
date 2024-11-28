package com.flowcraft.backend.config;

import org.springframework.boot.actuate.autoconfigure.security.servlet.EndpointRequest;
import org.springframework.boot.actuate.health.HealthEndpoint;
import org.springframework.boot.actuate.metrics.export.prometheus.PrometheusScrapeEndpoint;
import org.springframework.context.annotation.Bean;
import org.springframework.security.authentication.password.CompromisedPasswordChecker;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.annotation.web.configurers.HeadersConfigurer.FrameOptionsConfig;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationConverter;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.password.HaveIBeenPwnedRestApiPasswordChecker;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;
import java.util.Map;

import static com.flowcraft.backend.mongodb.controller.GetController.REST_PATH;
import static com.flowcraft.backend.mongodb.security.AuthController.AUTH_PATH;
import static com.flowcraft.backend.mongodb.security.enums.Rolle.ADMIN;
import static com.flowcraft.backend.mongodb.security.enums.Rolle.USER;
import static org.springframework.http.HttpMethod.GET;
import static org.springframework.http.HttpMethod.OPTIONS;
import static org.springframework.http.HttpMethod.POST;
import static org.springframework.security.config.http.SessionCreationPolicy.STATELESS;
import static org.springframework.security.crypto.factory.PasswordEncoderFactories.createDelegatingPasswordEncoder;

public sealed interface SecurityConfig permits ApplicationConfig {

    @Bean
    default SecurityFilterChain securityFilterChain(HttpSecurity httpSecurity) throws Exception {
        return httpSecurity
            .authorizeHttpRequests(authorize -> {
                authorize
                    .requestMatchers(GET, REST_PATH).hasRole(ADMIN.getRole())
                    .requestMatchers(GET, REST_PATH + "/**").hasAnyRole(ADMIN.getRole(), USER.getRole())
//                    .requestMatchers(OPTIONS, REST_PATH + "/**").permitAll()
                    .requestMatchers(GET, AUTH_PATH + "/me").hasRole(ADMIN.getRole())
                    .requestMatchers(POST, "/graphql", AUTH_PATH + "/login").permitAll()
                    .requestMatchers(
                        EndpointRequest.to(HealthEndpoint.class),
                        EndpointRequest.to(PrometheusScrapeEndpoint.class)
                    ).permitAll()
                    .requestMatchers(GET, "/swagger-ui/**", "/v3/api-docs/**", "/graphiql").permitAll()
                    .requestMatchers("/error", "/error/**").permitAll()
                    .anyRequest().authenticated();
            })
            .oauth2ResourceServer(oauth2 -> oauth2.jwt(jwt -> jwt.jwtAuthenticationConverter(jwtAuthenticationConverter())))
            .sessionManagement(session -> session.sessionCreationPolicy(STATELESS))
            .formLogin(AbstractHttpConfigurer::disable)
            .csrf(AbstractHttpConfigurer::disable)
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))
            .headers(headers -> headers.frameOptions(FrameOptionsConfig::sameOrigin))
            .build();
    }

    /**
     * Definiert die Passwortkodierung für die Anwendung.
     *
     * @return Ein PasswordEncoder zur sicheren Speicherung von Passwörtern.
     */
    @Bean
    default PasswordEncoder passwordEncoder() {
        return createDelegatingPasswordEncoder();
    }

    @Bean
    default CompromisedPasswordChecker compromisedPasswordChecker() {
        return new HaveIBeenPwnedRestApiPasswordChecker();
    }

    /**
     * Konfiguriert die CORS-Regeln der Anwendung.
     *
     * @return Die CORS-Konfigurationsquelle.
     */
    @Bean
    default CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(List.of("http://localhost:3000", "https://mydomain.com", "http://localhost:3000"));
        configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(List.of("Authorization", "Content-Type"));
        configuration.setExposedHeaders(List.of("Authorization"));
        configuration.setAllowCredentials(true);
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }

    /**
     * Definiert den JWT-Converter für die Sicherheitskonfiguration.
     * Hier wird sichergestellt, dass Rollen korrekt extrahiert und zugewiesen werden.
     *
     * @return Ein Converter, der JWT in AbstractAuthenticationToken umwandelt.
     */
    default JwtAuthenticationConverter jwtAuthenticationConverter() {
        JwtAuthenticationConverter jwtAuthenticationConverter = new JwtAuthenticationConverter();
        jwtAuthenticationConverter.setJwtGrantedAuthoritiesConverter(jwt -> {
            Collection<GrantedAuthority> authorities = new ArrayList<>();

            // Realm-Rollen hinzufügen
            List<String> realmRoles = jwt.getClaimAsStringList("realm_access.roles");
            if (realmRoles != null) {
                realmRoles.stream()
                    .map(role -> new SimpleGrantedAuthority(String.format("ROLE_%s", role)))
                    .forEach(authorities::add);
            }

            // Client-spezifische Rollen (z.B. rolemapper)
            Map<String, Object> resourceAccess = jwt.getClaim("resource_access");
            if (resourceAccess != null) {
                @SuppressWarnings("unchecked")
                Map<String, Object> roleMapper = (Map<String, Object>) resourceAccess.get("rolemapper");
                if (roleMapper != null && roleMapper.containsKey("roles")) {
                    @SuppressWarnings("unchecked")
                    List<String> clientRoles = (List<String>) roleMapper.get("roles");
                    clientRoles.stream()
                        .map(role -> new SimpleGrantedAuthority(String.format("ROLE_%s", role)))
                        .forEach(authorities::add);
                }
            }
            return authorities;
        });

        return jwtAuthenticationConverter;
    }
}
