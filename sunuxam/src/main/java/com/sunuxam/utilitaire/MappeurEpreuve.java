package com.sunuxam.utilitaire;

import com.sunuxam.dto.ReponseEpreuve;
import com.sunuxam.modele.Epreuve;

/**
 * Conversion des epreuves vers leur DTO.
 */
public final class MappeurEpreuve {

    private MappeurEpreuve() {
    }

    public static ReponseEpreuve versReponse(Epreuve epreuve) {
        return new ReponseEpreuve(
                epreuve.getId(),
                epreuve.getIntitule(),
                epreuve.getDescription(),
                epreuve.getCoefficient(),
                epreuve.getDureeMinutes(),
                epreuve.getConcours().getId());
    }
}
