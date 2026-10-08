package com.sunuxam.service.implementation;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

import com.sunuxam.depot.DepotUtilisateur;
import com.sunuxam.dto.DemandeInscription;
import com.sunuxam.dto.ReponseUtilisateur;
import com.sunuxam.exception.ExceptionMetier;
import com.sunuxam.modele.Role;
import com.sunuxam.modele.Utilisateur;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

@ExtendWith(MockitoExtension.class)
class ServiceUtilisateurImplTest {

    @Mock
    private DepotUtilisateur depotUtilisateur;

    @Mock
    private PasswordEncoder encodeurMotDePasse;

    @InjectMocks
    private ServiceUtilisateurImpl service;

    @Test
    void inscrit_un_candidat_avec_un_mot_de_passe_chiffre() {
        DemandeInscription demande = new DemandeInscription(
                "Diop", "Awa", "Awa@Test.SN", "motdepasse123", "770000000");
        when(depotUtilisateur.existsByEmail("awa@test.sn")).thenReturn(false);
        when(encodeurMotDePasse.encode("motdepasse123")).thenReturn("HACHE");
        when(depotUtilisateur.save(any(Utilisateur.class)))
                .thenAnswer(invocation -> invocation.getArgument(0));

        ReponseUtilisateur reponse = service.inscrireCandidat(demande);

        assertThat(reponse.email()).isEqualTo("awa@test.sn");
        assertThat(reponse.role()).isEqualTo(Role.ROLE_CANDIDAT);
    }

    @Test
    void refuse_une_inscription_avec_un_email_deja_utilise() {
        DemandeInscription demande = new DemandeInscription(
                "Diop", "Awa", "awa@test.sn", "motdepasse123", null);
        when(depotUtilisateur.existsByEmail("awa@test.sn")).thenReturn(true);

        assertThatThrownBy(() -> service.inscrireCandidat(demande))
                .isInstanceOf(ExceptionMetier.class);
    }
}
