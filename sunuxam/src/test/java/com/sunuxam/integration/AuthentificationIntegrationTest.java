package com.sunuxam.integration;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.sunuxam.dto.DemandeConnexion;
import com.sunuxam.dto.DemandeInscription;
import com.sunuxam.modele.Role;
import org.junit.jupiter.api.Test;
import org.springframework.http.MediaType;

class AuthentificationIntegrationTest extends BaseIntegrationTest {

    @Test
    void inscription_puis_connexion_retournent_un_jeton() throws Exception {
        DemandeInscription inscription = new DemandeInscription(
                "Diop", "Awa", "awa@test.sn", "motdepasse123", "770000000");

        mockMvc.perform(post("/api/authentification/inscription")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(inscription)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.token").isNotEmpty())
                .andExpect(jsonPath("$.role").value("ROLE_CANDIDAT"));

        DemandeConnexion connexion = new DemandeConnexion("awa@test.sn", "motdepasse123");

        mockMvc.perform(post("/api/authentification/connexion")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(connexion)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.token").isNotEmpty());
    }

    @Test
    void connexion_avec_un_mauvais_mot_de_passe_retourne_401() throws Exception {
        creerUtilisateur("bob@test.sn", "bonMotDePasse", Role.ROLE_CANDIDAT);
        DemandeConnexion connexion = new DemandeConnexion("bob@test.sn", "mauvais");

        mockMvc.perform(post("/api/authentification/connexion")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(connexion)))
                .andExpect(status().isUnauthorized());
    }
}
