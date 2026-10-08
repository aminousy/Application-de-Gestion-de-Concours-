package com.sunuxam.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;


public record DemandeCandidature(

        @NotNull Long concoursId,

        @Size(max = 2000) String motivation) {
}
