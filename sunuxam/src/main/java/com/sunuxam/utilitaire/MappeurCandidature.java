package com.sunuxam.utilitaire;

import com.sunuxam.dto.ReponseCandidature;
import com.sunuxam.modele.Candidature;
import com.sunuxam.modele.Concours;
import com.sunuxam.modele.Utilisateur;


public final class MappeurCandidature {

    private MappeurCandidature() {
    }

    public static ReponseCandidature versReponse(Candidature candidature) {
        Utilisateur candidat = candidature.getCandidat();
        Concours concours = candidature.getConcours();
        return new ReponseCandidature(
                candidature.getId(),
                concours.getId(),
                concours.getTitre(),
                candidat.getId(),
                candidat.getNom(),
                candidat.getPrenom(),
                candidat.getEmail(),
                candidature.getStatut(),
                candidature.getDateDepot(),
                candidature.getMotivation());
    }
}
