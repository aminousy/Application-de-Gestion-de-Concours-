package com.sunuxam.utilitaire;

import com.sunuxam.dto.ReponseUtilisateur;
import com.sunuxam.modele.Utilisateur;

public final class MappeurUtilisateur {

    private MappeurUtilisateur() {
    }

    public static ReponseUtilisateur versReponse(Utilisateur utilisateur) {
        return new ReponseUtilisateur(
                utilisateur.getId(),
                utilisateur.getNom(),
                utilisateur.getPrenom(),
                utilisateur.getEmail(),
                utilisateur.getTelephone(),
                utilisateur.getRole(),
                utilisateur.isActif(),
                utilisateur.getDateCreation());
    }
}
