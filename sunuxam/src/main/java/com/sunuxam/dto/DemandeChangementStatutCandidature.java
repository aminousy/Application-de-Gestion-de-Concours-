package com.sunuxam.dto;

import com.sunuxam.modele.StatutCandidature;
import jakarta.validation.constraints.NotNull;


public record DemandeChangementStatutCandidature(

        @NotNull StatutCandidature statut) {
}
