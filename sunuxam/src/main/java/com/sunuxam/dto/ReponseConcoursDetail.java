package com.sunuxam.dto;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;


public record ReponseConcoursDetail(

        Long id,

        String titre,

        String description,

        LocalDate dateLimiteCandidature,

        LocalDate dateDeliberation,

        int nombrePlaces,

        boolean ouvert,

        boolean resultatsPublies,

        LocalDateTime datePublicationResultats,

        List<ReponseEpreuve> epreuves) {
}
