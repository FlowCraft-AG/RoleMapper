package com.flowcraft.backend.config;

import com.flowcraft.backend.mongodb.security.KeycloakRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.annotation.Bean;
import org.springframework.web.client.RestClient;
import org.springframework.web.client.support.RestClientAdapter;
import org.springframework.web.service.invoker.HttpServiceProxyFactory;
import org.springframework.web.util.UriComponentsBuilder;

/**
 * Schnittstelle zur Konfiguration des Keycloak-Clients.
 */
sealed interface KeycloakClientConfig permits ApplicationConfig {
    Logger LOGGER = LoggerFactory.getLogger(KeycloakClientConfig.class);

    /**
     * Erstellt einen KeycloakRepository-Bean, um HTTP-Aufrufe an Keycloak zu ermöglichen.
     *
     * @param clientBuilder Der RestClient.Builder.
     * @return Eine Instanz von KeycloakRepository.
     */
    @Bean
    default KeycloakRepository keycloakRepository(
        final RestClient.Builder clientBuilder
    ) {
        final var kcDefaultPort = 8880;

        final var kcSchemaEnv = System.getenv("KC_SERVICE_SCHEMA");
        final var kcHostEnv = System.getenv("KC_SERVICE_HOST");
        final var kcPortEnv = System.getenv("KC_SERVICE_PORT");

        final var schema = kcSchemaEnv == null ? "http" : kcSchemaEnv;
        final var host = kcHostEnv == null ? "localhost" : kcHostEnv;
        final int port = kcPortEnv == null ? kcDefaultPort : Integer.parseInt(kcPortEnv);
        final var baseUri = UriComponentsBuilder.newInstance()
            .scheme(schema)
            .host(host)
            .port(port)
            .build();
        LOGGER.debug("keycloakRepository: baseUri={}", baseUri);

        final var restClient = clientBuilder.baseUrl(baseUri.toUriString()).build();
        final var clientAdapter = RestClientAdapter.create(restClient);
        final var proxyFactory = HttpServiceProxyFactory.builderFor(clientAdapter).build();
        return proxyFactory.createClient(KeycloakRepository.class);
    }
}
