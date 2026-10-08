package com.sunuxam.dto;

import com.sunuxam.modele.Role;


public record DemandeAdministrationUtilisateur(

        Role role,

        Boolean actif) {
}
