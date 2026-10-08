package com.sunuxam.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;
import java.time.LocalDate;


public record DemandeConcours(

        @NotBlank @Size(max = 200) String titre,

        @Size(max = 2000) String description,

        @NotNull LocalDate dateLimiteCandidature,

        LocalDate dateDeliberation,

        @NotNull @Positive Integer nombrePlaces,

        boolean ouvert) {
}
