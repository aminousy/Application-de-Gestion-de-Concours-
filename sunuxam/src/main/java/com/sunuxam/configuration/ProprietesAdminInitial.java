package com.sunuxam.configuration;

import org.springframework.boot.context.properties.ConfigurationProperties;


@ConfigurationProperties(prefix = "sunuxam.admin-initial")
public record ProprietesAdminInitial(

        boolean creationAutomatique,

        String nom,

        String prenom,

        String email,

        String motDePasse) {
}
