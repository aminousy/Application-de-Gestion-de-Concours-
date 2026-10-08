package com.sunuxam.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;


public record DemandeMiseAJourEpreuve(

        @NotBlank @Size(max = 200) String intitule,

        @Size(max = 1000) String description,

        @NotNull @Positive Double coefficient,

        @NotNull @Positive Integer dureeMinutes) {
}
