package com.sunuxam.integration;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.sunuxam.depot.DepotUtilisateur;
import com.sunuxam.modele.Role;
import com.sunuxam.modele.Utilisateur;
import com.sunuxam.securite.FournisseurJetonJwt;
import org.junit.jupiter.api.BeforeEach;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.HttpHeaders;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;


@SpringBootTest
@AutoConfigureMockMvc
@Transactional
abstract class BaseIntegrationTest {

    @Autowired
    protected MockMvc mockMvc;

    @Autowired
    protected ObjectMapper objectMapper;

    @Autowired
    protected DepotUtilisateur depotUtilisateur;

    @Autowired
    protected PasswordEncoder encodeurMotDePasse;

    @Autowired
    protected FournisseurJetonJwt fournisseurJeton;

    @BeforeEach
    void reinitialiserUtilisateurs() {
        depotUtilisateur.deleteAll();
    }

    protected Utilisateur creerUtilisateur(String email, String motDePasse, Role role) {
        Utilisateur utilisateur = new Utilisateur(
                "Nom", "Prenom", email, encodeurMotDePasse.encode(motDePasse), role);
        return depotUtilisateur.save(utilisateur);
    }

    protected String enTeteJeton(Utilisateur utilisateur) {
        return "Bearer " + fournisseurJeton.genererJeton(utilisateur.getEmail(), utilisateur.getRole());
    }

    protected static String autorisation() {
        return HttpHeaders.AUTHORIZATION;
    }
}
