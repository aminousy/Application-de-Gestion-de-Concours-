package com.sunuxam.service;

import com.sunuxam.dto.DemandeCandidature;
import com.sunuxam.dto.DemandeChangementStatutCandidature;
import com.sunuxam.dto.ReponseCandidature;
import com.sunuxam.modele.StatutCandidature;
import java.util.List;


public interface ServiceCandidature {


    ReponseCandidature deposer(Long candidatId, DemandeCandidature demande);

    List<ReponseCandidature> listerMesCandidatures(Long candidatId);

    List<ReponseCandidature> listerParConcours(Long concoursId);

    List<ReponseCandidature> listerParConcoursEtStatut(Long concoursId, StatutCandidature statut);

    ReponseCandidature obtenirParId(Long id);


    ReponseCandidature obtenirPourCandidat(Long id, Long candidatId);

    ReponseCandidature changerStatut(Long id, DemandeChangementStatutCandidature demande);


    void retirerParCandidat(Long id, Long candidatId);

    void supprimer(Long id);
}
