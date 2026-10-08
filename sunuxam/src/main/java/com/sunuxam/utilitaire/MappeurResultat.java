package com.sunuxam.utilitaire;

import com.sunuxam.dto.ReponseResultat;
import com.sunuxam.modele.Candidature;
import com.sunuxam.modele.Resultat;
import com.sunuxam.modele.Utilisateur;

/**
 * Conversion des resultats vers leur DTO.
 */
public final class MappeurResultat {

    private MappeurResultat() {
    }

    public static ReponseResultat versReponse(Resultat resultat) {
        Candidature candidature = resultat.getCandidature();
        Utilisateur candidat = candidature.getCandidat();
        return new ReponseResultat(
                resultat.getId(),
                candidature.getId(),
                candidature.getConcours().getId(),
                candidat.getNom(),
                candidat.getPrenom(),
                resultat.getMoyenne(),
                resultat.getRang(),
                resultat.isAdmis(),
                resultat.getDecision(),
                resultat.getDateCalcul());
    }
}
