package com.sunuxam.utilitaire;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

import com.sunuxam.modele.Epreuve;
import com.sunuxam.modele.Note;
import java.util.List;
import org.junit.jupiter.api.Test;

class CalculateurMoyenneTest {

    private static Note note(double coefficient, double valeur) {
        Epreuve epreuve = new Epreuve("Epreuve", null, coefficient, 60);
        return new Note(null, epreuve, valeur);
    }

    @Test
    void calcule_la_moyenne_ponderee_arrondie_a_deux_decimales() {
        List<Note> notes = List.of(note(3, 14.5), note(2, 12));

        assertThat(CalculateurMoyenne.moyennePonderee(notes)).isEqualTo(13.50);
    }

    @Test
    void refuse_une_liste_de_notes_vide() {
        assertThatThrownBy(() -> CalculateurMoyenne.moyennePonderee(List.of()))
                .isInstanceOf(IllegalArgumentException.class);
    }

    @Test
    void refuse_une_somme_de_coefficients_nulle() {
        assertThatThrownBy(() -> CalculateurMoyenne.moyennePonderee(List.of(note(0, 10))))
                .isInstanceOf(IllegalArgumentException.class);
    }
}
