package com.sunuxam.service.implementation;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

import com.sunuxam.depot.DepotCandidature;
import com.sunuxam.depot.DepotConcours;
import com.sunuxam.depot.DepotEpreuve;
import com.sunuxam.depot.DepotNote;
import com.sunuxam.depot.DepotResultat;
import com.sunuxam.dto.ReponseResultat;
import com.sunuxam.exception.ExceptionMetier;
import com.sunuxam.modele.Candidature;
import com.sunuxam.modele.Concours;
import com.sunuxam.modele.Epreuve;
import com.sunuxam.modele.Note;
import com.sunuxam.modele.Resultat;
import com.sunuxam.modele.Role;
import com.sunuxam.modele.Utilisateur;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
class ServiceResultatImplTest {

    @Mock
    private DepotResultat depotResultat;
    @Mock
    private DepotCandidature depotCandidature;
    @Mock
    private DepotNote depotNote;
    @Mock
    private DepotEpreuve depotEpreuve;
    @Mock
    private DepotConcours depotConcours;

    @InjectMocks
    private ServiceResultatImpl service;

    private Concours concours;
    private Candidature candidature;
    private Epreuve epreuve1;
    private Epreuve epreuve2;

    @BeforeEach
    void preparer() {
        concours = new Concours("Concours", "desc",
                LocalDate.now().plusDays(10), LocalDate.now().plusDays(20), 1);
        concours.setOuvert(true);
        epreuve1 = new Epreuve("E1", null, 3, 120);
        epreuve1.setConcours(concours);
        epreuve2 = new Epreuve("E2", null, 2, 90);
        epreuve2.setConcours(concours);
        Utilisateur candidat = new Utilisateur("Diop", "Awa", "awa@test.sn", "x", Role.ROLE_CANDIDAT);
        candidature = new Candidature(candidat, concours, null);
    }

    @Test
    void refuse_le_calcul_si_toutes_les_notes_ne_sont_pas_saisies() {
        when(depotCandidature.findById(1L)).thenReturn(Optional.of(candidature));
        when(depotEpreuve.findByConcoursId(any())).thenReturn(List.of(epreuve1, epreuve2));
        when(depotNote.findByCandidatureId(any()))
                .thenReturn(List.of(new Note(candidature, epreuve1, 12)));

        assertThatThrownBy(() -> service.calculerPourCandidature(1L))
                .isInstanceOf(ExceptionMetier.class);
    }

    @Test
    void calcule_la_moyenne_ponderee_d_une_candidature() {
        when(depotCandidature.findById(1L)).thenReturn(Optional.of(candidature));
        when(depotEpreuve.findByConcoursId(any())).thenReturn(List.of(epreuve1, epreuve2));
        when(depotNote.findByCandidatureId(any())).thenReturn(List.of(
                new Note(candidature, epreuve1, 14.5),
                new Note(candidature, epreuve2, 12)));
        when(depotResultat.findByCandidatureId(any())).thenReturn(Optional.empty());
        when(depotResultat.save(any(Resultat.class))).thenAnswer(i -> i.getArgument(0));

        ReponseResultat reponse = service.calculerPourCandidature(1L);

        assertThat(reponse.moyenne()).isEqualTo(13.50);
    }

    @Test
    void publie_les_resultats_d_un_concours() {
        when(depotConcours.findById(5L)).thenReturn(Optional.of(concours));
        when(depotResultat.findByCandidature_ConcoursId(5L))
                .thenReturn(List.of(new Resultat(candidature, 13.5)));
        when(depotConcours.save(any(Concours.class))).thenAnswer(i -> i.getArgument(0));

        service.publierResultats(5L);

        assertThat(concours.isResultatsPublies()).isTrue();
        assertThat(concours.getDatePublicationResultats()).isNotNull();
    }
}
