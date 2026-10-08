package com.sunuxam.service;

import com.sunuxam.dto.DemandeDeliberation;
import com.sunuxam.dto.ReponseResultat;
import java.util.List;

public interface ServiceResultat {

    ReponseResultat calculerPourCandidature(Long candidatureId);

    /** Calcule les resultats de toutes les candidatures*/
    List<ReponseResultat> calculerPourConcours(Long concoursId);

    /** Applique une decision de jury   */
    ReponseResultat deliberer(Long candidatureId, DemandeDeliberation demande);

    void publierResultats(Long concoursId);

    List<ReponseResultat> listerParConcours(Long concoursId);


    ReponseResultat obtenirParCandidature(Long candidatureId);

    /** Consultation du resultat par le candidat  */
    ReponseResultat obtenirPourCandidat(Long candidatureId, Long candidatId);
}
