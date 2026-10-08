package com.sunuxam.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;


public record DemandeChangementMotDePasse(

        @NotBlank String ancienMotDePasse,

        @NotBlank @Size(min = 8, max = 100) String nouveauMotDePasse) {
}
