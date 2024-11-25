package com.flowcraft.backend;

import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties(prefix = "app.mail")
public record MailProps(
    String from,
    String to
) {
}
