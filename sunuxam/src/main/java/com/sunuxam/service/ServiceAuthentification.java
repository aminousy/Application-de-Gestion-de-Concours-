package com.sunuxam.service;

import com.sunuxam.dto.DemandeConnexion;
import com.sunuxam.dto.DemandeInscription;
import com.sunuxam.dto.ReponseAuthentification;


public interface ServiceAuthentification {


    ReponseAuthentification inscrire(DemandeInscription demande);


    ReponseAuthentification connecter(DemandeConnexion demande);
}
