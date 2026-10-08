package com.sunuxam.dto;

import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;


public record DemandeNote(

        @NotNull Long candidatureId,

        @NotNull Long epreuveId,

        @NotNull @DecimalMin("0.0") @DecimalMax("20.0") Double valeur) {
}
