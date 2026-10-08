package com.sunuxam.configuration;

import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.License;
import io.swagger.v3.oas.models.security.SecurityRequirement;
import io.swagger.v3.oas.models.security.SecurityScheme;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * Configuration de la documentation OpenAPI
 */
@Configuration
public class ConfigurationOpenApi {

    private static final String SCHEMA_JWT = "bearerAuth";

    @Bean
    public OpenAPI documentationSunuXam() {
        return new OpenAPI()
                .info(new Info()
                        .title("API SunuXam")
                        .description("API REST de gestion de concours et d'examens : "
                                + "utilisateurs, concours, epreuves, candidatures, notes et resultats.")
                        .version("1.0.0")
                        .contact(new Contact()
                                .name("Equipe SunuXam")
                                .email("contact@sunuxam.sn"))
                        .license(new License().name("Usage academique")))
                .addSecurityItem(new SecurityRequirement().addList(SCHEMA_JWT))
                .components(new Components().addSecuritySchemes(SCHEMA_JWT,
                        new SecurityScheme()
                                .name(SCHEMA_JWT)
                                .type(SecurityScheme.Type.HTTP)
                                .scheme("bearer")
                                .bearerFormat("JWT")
                                .description("Jeton JWT obtenu via POST /api/authentification/connexion, "
                                        + "a fournir dans l'en-tete Authorization : Bearer <jeton>")));
    }
}
