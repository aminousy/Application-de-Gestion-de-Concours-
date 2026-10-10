package com.sunuxam.dto;

import java.time.LocalDateTime;


public record ReponseResultat(

        Long id,

        Long candidatureId,

        Long concoursId,

        String nomCandidat,

        String prenomCandidat,

        double moyenne,

        Integer rang,

        boolean admis,

        String decision,

        LocalDateTime dateCalcul) {
}
