package com.sunuxam.utilitaire;

import com.sunuxam.dto.ReponseEpreuve;
import com.sunuxam.modele.Epreuve;


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
