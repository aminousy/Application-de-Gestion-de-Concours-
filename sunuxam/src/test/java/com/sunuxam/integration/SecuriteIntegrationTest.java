package com.sunuxam.integration;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.sunuxam.modele.Role;
import com.sunuxam.modele.Utilisateur;
import org.junit.jupiter.api.Test;
import org.springframework.http.MediaType;

class SecuriteIntegrationTest extends BaseIntegrationTest {

    @Test
    void un_candidat_ne_peut_pas_lister_les_utilisateurs() throws Exception {
        Utilisateur candidat = creerUtilisateur("cand@test.sn", "motdepasse123", Role.ROLE_CANDIDAT);

        mockMvc.perform(get("/api/utilisateurs").header(autorisation(), enTeteJeton(candidat)))
                .andExpect(status().isForbidden());
    }

    @Test
    void un_candidat_ne_peut_pas_creer_de_concours() throws Exception {
        Utilisateur candidat = creerUtilisateur("cand2@test.sn", "motdepasse123", Role.ROLE_CANDIDAT);

        mockMvc.perform(post("/api/concours")
                        .header(autorisation(), enTeteJeton(candidat))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"titre\":\"Essai\",\"dateLimiteCandidature\":\"2030-01-01\","
                                + "\"nombrePlaces\":10,\"ouvert\":true}"))
                .andExpect(status().isForbidden());
    }

    @Test
    void sans_jeton_l_acces_a_une_ressource_protegee_retourne_401() throws Exception {
        mockMvc.perform(get("/api/utilisateurs"))
                .andExpect(status().isUnauthorized());
    }
}
