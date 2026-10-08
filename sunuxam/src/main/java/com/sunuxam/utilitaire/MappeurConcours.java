package com.sunuxam.utilitaire;

import com.sunuxam.dto.ReponseConcours;
import com.sunuxam.dto.ReponseConcoursDetail;
import com.sunuxam.dto.ReponseEpreuve;
import com.sunuxam.modele.Concours;
import java.util.List;


public final class MappeurConcours {

    private MappeurConcours() {
    }

    public static ReponseConcours versReponse(Concours concours, long nombreEpreuves) {
        return new ReponseConcours(
                concours.getId(),
                concours.getTitre(),
                concours.getDescription(),
                concours.getDateLimiteCandidature(),
                concours.getDateDeliberation(),
                concours.getNombrePlaces(),
                concours.isOuvert(),
                concours.isResultatsPublies(),
                concours.getDatePublicationResultats(),
                nombreEpreuves);
    }

    public static ReponseConcoursDetail versDetail(Concours concours) {
        List<ReponseEpreuve> epreuves = concours.getEpreuves().stream()
                .map(MappeurEpreuve::versReponse)
                .toList();
        return new ReponseConcoursDetail(
                concours.getId(),
                concours.getTitre(),
                concours.getDescription(),
                concours.getDateLimiteCandidature(),
                concours.getDateDeliberation(),
                concours.getNombrePlaces(),
                concours.isOuvert(),
                concours.isResultatsPublies(),
                concours.getDatePublicationResultats(),
                epreuves);
    }
}
