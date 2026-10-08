package com.sunuxam.dto;

import java.time.LocalDateTime;

/**
 * Representation d'une note saisie.
 */
public record ReponseNote(

        Long id,

        Long candidatureId,

        Long epreuveId,

        String intituleEpreuve,

        double coefficient,

        double valeur,

        LocalDateTime dateSaisie) {
}
