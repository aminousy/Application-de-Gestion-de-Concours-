package com.sunuxam.dto;

import com.sunuxam.modele.Role;
import java.time.Instant;


public record ReponseUtilisateur(

        Long id,

        String nom,

        String prenom,

        String email,

        String telephone,

        Role role,

        boolean actif,

        Instant dateCreation) {
}
