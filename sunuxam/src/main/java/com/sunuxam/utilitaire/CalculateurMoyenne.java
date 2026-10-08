package com.sunuxam.utilitaire;

import com.sunuxam.modele.Note;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.List;


public final class CalculateurMoyenne {

    private CalculateurMoyenne() {
    }

    public static double moyennePonderee(List<Note> notes) {
        if (notes == null || notes.isEmpty()) {
            throw new IllegalArgumentException("Au moins une note est requise pour calculer une moyenne");
        }
        double sommeCoefficients = 0d;
        double sommePonderee = 0d;
        for (Note note : notes) {
            double coefficient = note.getEpreuve().getCoefficient();
            sommeCoefficients += coefficient;
            sommePonderee += note.getValeur() * coefficient;
        }
        if (sommeCoefficients <= 0d) {
            throw new IllegalArgumentException("La somme des coefficients doit etre strictement positive");
        }
        return BigDecimal.valueOf(sommePonderee / sommeCoefficients)
                .setScale(2, RoundingMode.HALF_UP)
                .doubleValue();
    }
}
