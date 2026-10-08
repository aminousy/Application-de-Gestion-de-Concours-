package com.sunuxam.dto;

import com.sunuxam.modele.StatutCandidature;
import java.time.LocalDateTime;


public record ReponseCandidature(

        Long id,

        Long concoursId,

        String titreConcours,

        Long candidatId,

        String nomCandidat,

        String prenomCandidat,

        String emailCandidat,

        StatutCandidature statut,

        LocalDateTime dateDepot,

        String motivation) {
}
