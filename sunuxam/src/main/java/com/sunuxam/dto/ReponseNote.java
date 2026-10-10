package com.sunuxam.dto;

import java.time.LocalDateTime;


public record ReponseNote(

        Long id,

        Long candidatureId,

        Long epreuveId,

        String intituleEpreuve,

        double coefficient,

        double valeur,

        LocalDateTime dateSaisie) {
}
