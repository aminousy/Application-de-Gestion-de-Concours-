package com.sunuxam.integration;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.fasterxml.jackson.databind.JsonNode;
import com.sunuxam.modele.Role;
import com.sunuxam.modele.Utilisateur;
import org.junit.jupiter.api.Test;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MvcResult;

class ParcoursConcoursIntegrationTest extends BaseIntegrationTest {

    @Test
    void parcours_complet_de_la_creation_du_concours_a_la_publication_des_resultats() throws Exception {
        Utilisateur admin = creerUtilisateur("admin@test.sn", "motdepasse123", Role.ROLE_ADMIN);
        Utilisateur candidat = creerUtilisateur("cand@test.sn", "motdepasse123", Role.ROLE_CANDIDAT);
        String jetonAdmin = enTeteJeton(admin);
        String jetonCandidat = enTeteJeton(candidat);

        long concoursId = idDepuis(mockMvc.perform(post("/api/concours")
                        .header(autorisation(), jetonAdmin)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"titre\":\"Concours 2026\",\"description\":\"Recrutement\","
                                + "\"dateLimiteCandidature\":\"2030-12-31\",\"dateDeliberation\":\"2031-01-15\","
                                + "\"nombrePlaces\":1,\"ouvert\":true}"))
                .andExpect(status().isCreated())
                .andReturn());

        long epreuve1 = idDepuis(mockMvc.perform(post("/api/epreuves")
                        .header(autorisation(), jetonAdmin)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"intitule\":\"Culture generale\",\"coefficient\":3,"
                                + "\"dureeMinutes\":180,\"concoursId\":" + concoursId + "}"))
                .andExpect(status().isCreated())
                .andReturn());

        long epreuve2 = idDepuis(mockMvc.perform(post("/api/epreuves")
                        .header(autorisation(), jetonAdmin)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"intitule\":\"Note de synthese\",\"coefficient\":2,"
                                + "\"dureeMinutes\":120,\"concoursId\":" + concoursId + "}"))
                .andExpect(status().isCreated())
                .andReturn());

        long candidatureId = idDepuis(mockMvc.perform(post("/api/candidatures")
                        .header(autorisation(), jetonCandidat)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"concoursId\":" + concoursId + ",\"motivation\":\"Motive\"}"))
                .andExpect(status().isCreated())
                .andReturn());

        saisirNote(jetonAdmin, candidatureId, epreuve1, "14.5");
        saisirNote(jetonAdmin, candidatureId, epreuve2, "12");

        mockMvc.perform(post("/api/resultats/concours/" + concoursId + "/calcul")
                        .header(autorisation(), jetonAdmin))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].moyenne").value(13.5))
                .andExpect(jsonPath("$[0].rang").value(1))
                .andExpect(jsonPath("$[0].admis").value(true));

        mockMvc.perform(post("/api/resultats/concours/" + concoursId + "/publication")
                        .header(autorisation(), jetonAdmin))
                .andExpect(status().isNoContent());

        mockMvc.perform(get("/api/resultats/candidatures/" + candidatureId)
                        .header(autorisation(), jetonCandidat))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.moyenne").value(13.5))
                .andExpect(jsonPath("$.admis").value(true));
    }

    private void saisirNote(String jetonAdmin, long candidatureId, long epreuveId, String valeur)
            throws Exception {
        mockMvc.perform(post("/api/notes")
                        .header(autorisation(), jetonAdmin)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"candidatureId\":" + candidatureId + ",\"epreuveId\":" + epreuveId
                                + ",\"valeur\":" + valeur + "}"))
                .andExpect(status().isOk());
    }

    private long idDepuis(MvcResult resultat) throws Exception {
        JsonNode noeud = objectMapper.readTree(resultat.getResponse().getContentAsString());
        return noeud.get("id").asLong();
    }
}
