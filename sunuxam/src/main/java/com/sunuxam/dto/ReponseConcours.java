package com.sunuxam.dto;

import java.time.LocalDate;
import java.time.LocalDateTime;


public record ReponseConcours(

        Long id,

        String titre,

        String description,

        LocalDate dateLimiteCandidature,

        LocalDate dateDeliberation,

        int nombrePlaces,

        boolean ouvert,

        boolean resultatsPublies,

        LocalDateTime datePublicationResultats,

        long nombreEpreuves) {
}
