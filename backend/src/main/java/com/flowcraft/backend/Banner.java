package com.flowcraft.backend;

import org.springframework.boot.SpringBootVersion;
import org.springframework.core.SpringVersion;

import java.net.InetAddress;
import java.net.UnknownHostException;
import java.util.Locale;
import java.util.Objects;

final class Banner {
    private static final String FIGLET = """
         ____       _      __  __                            \s
        |  _ \\ ___ | | ___|  \\/  | __ _ _ __  _ __   ___ _ __\s
        | |_) / _ \\| |/ _ \\ |\\/| |/ _` | '_ \\| '_ \\ / _ \\ '__|
        |  _ < (_) | |  __/ |  | | (_| | |_) | |_) |  __/ |  \s
        |_| \\_\\___/|_|\\___|_|  |_|\\__,_| .__/| .__/ \\___|_|  \s
                                       |_|   |_|             \s""";

    static final String TEXT = """

        $figlet
        (C) FlowCraft AG - RoleMapper System
        Version             2024.04.1
        Spring Boot         $springBoot
        Spring Security     $springSecurity
        Spring Framework    $spring
        Java                $java
        Betriebssystem      $os
        Rechnername         $rechnername
        IP-Adresse          $ip
        Heap: Size          $heapSize
        Heap: Free          $heapFree
        Benutzername        $username
        JVM Locale          $locale
        GraphiQL Endpoint   /graphiql
        OpenAPI Docs        swagger-ui/index.html /v3/api-docs.yaml
        Keycloak Realm      $keycloakRealm
        MongoDB Cluster     $mongoCluster
        Camunda Console     /camunda
        """
        .replace("$figlet", FIGLET)
        .replace("$springBoot", SpringBootVersion.getVersion())
//        .replace("$springSecurity", SpringSecurityCoreVersion.getVersion())
        .replace("$spring", Objects.requireNonNull(SpringVersion.getVersion()))
        .replace("$java", Runtime.version() + " - " + System.getProperty("java.vendor"))
        .replace("$os", System.getProperty("os.name"))
        .replace("$rechnername", getLocalhost().getHostName())
        .replace("$ip", getLocalhost().getHostAddress())
        .replace("$heapSize", Runtime.getRuntime().totalMemory() / (1024L * 1024L) + " MiB")
        .replace("$heapFree", Runtime.getRuntime().freeMemory() / (1024L * 1024L) + " MiB")
        .replace("$username", System.getProperty("user.name"))
        .replace("$locale", Locale.getDefault().toString())
        .replace("$keycloakRealm", "flowcraft")
        .replace("$mongoCluster", "mongodb+srv://cluster-url");

    @SuppressWarnings("ImplicitCallToSuper")
    private Banner() {
    }

    private static InetAddress getLocalhost() {
        try {
            return InetAddress.getLocalHost();
        } catch (final UnknownHostException ex) {
            throw new IllegalStateException(ex);
        }
    }
}
