package com.flowcraft.backend;

import org.springframework.boot.context.properties.ConfigurationProperties;

/**
 * Spring-Konfiguration für Properties "app.keycloak.*".
 *
 * @author <a href="mailto:Caleb_G@outlook.de">Caleb Gyamfi</a>
 * @param host Rechnername des Keycloak-Servers
 * @param clientId client-id gemäß der Client-Konfiguration in Keycloak
 * @param clientSecret Client-Secret gemäß der Client-Konfiguration in Keycloak
 * @param port der port auf dem keycloak läuft
 * @param schema http
 */
@ConfigurationProperties(prefix = "app.keycloak")
public record KeycloakProps(
    String schema,
    String host,
    int port,
    String clientId,
    String clientSecret
) {
}
