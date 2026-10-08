package com.sunuxam.service;

import com.sunuxam.dto.DemandeCandidature;
import com.sunuxam.dto.DemandeChangementStatutCandidature;
import com.sunuxam.dto.ReponseCandidature;
import com.sunuxam.modele.StatutCandidature;
import java.util.List;

/**
 * Operations de gestion des candidatures.
 */
public interface ServiceCandidature {

    /** Depot d'une candidature */
    ReponseCandidature deposer(Long candidatId, DemandeCandidature demande);

    List<ReponseCandidature> listerMesCandidatures(Long candidatId);

    List<ReponseCandidature> listerParConcours(Long concoursId);

    List<ReponseCandidature> listerParConcoursEtStatut(Long concoursId, StatutCandidature statut);

    ReponseCandidature obtenirParId(Long id);

    /** Consultation d'une candidature */
    ReponseCandidature obtenirPourCandidat(Long id, Long candidatId);

    ReponseCandidature changerStatut(Long id, DemandeChangementStatutCandidature demande);

    /** Retrait d'une candidature  */
    void retirerParCandidat(Long id, Long candidatId);

    void supprimer(Long id);
}
