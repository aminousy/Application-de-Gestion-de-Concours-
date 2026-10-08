package com.sunuxam.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;


public record DemandeInscription(

        @NotBlank @Size(max = 100) String nom,

        @NotBlank @Size(max = 100) String prenom,

        @NotBlank @Email @Size(max = 180) String email,

        @NotBlank @Size(min = 8, max = 100) String motDePasse,

        @Size(max = 30) String telephone) {
}
