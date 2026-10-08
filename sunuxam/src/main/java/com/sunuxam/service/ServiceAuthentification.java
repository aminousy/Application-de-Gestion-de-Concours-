package com.sunuxam.service;

import com.sunuxam.dto.DemandeConnexion;
import com.sunuxam.dto.DemandeInscription;
import com.sunuxam.dto.ReponseAuthentification;

/**
 Operations d'inscription et de connexion.
 */
public interface ServiceAuthentification {

    /** Inscrit un nouveau candidat */
    ReponseAuthentification inscrire(DemandeInscription demande);

    /** Verifie les identifiants */
    ReponseAuthentification connecter(DemandeConnexion demande);
}
