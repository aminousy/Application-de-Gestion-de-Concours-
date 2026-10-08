package com.sunuxam.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;


public record DemandeMiseAJourUtilisateur(

        @NotBlank @Size(max = 100) String nom,

        @NotBlank @Size(max = 100) String prenom,

        @Size(max = 30) String telephone) {
}
