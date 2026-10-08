package com.sunuxam.securite;

import org.springframework.boot.context.properties.ConfigurationProperties;


@ConfigurationProperties(prefix = "sunuxam.securite.jwt")
public record ProprietesJwt(String cleSecrete, long dureeValiditeMs, String emetteur) {
}
