package com.sunuxam.dto;

import jakarta.validation.constraints.Size;


public record DemandeDeliberation(

        Boolean admis,

        @Size(max = 500) String decision) {
}
