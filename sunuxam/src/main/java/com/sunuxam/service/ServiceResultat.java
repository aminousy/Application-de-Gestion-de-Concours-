package com.sunuxam.service;

import com.sunuxam.dto.DemandeDeliberation;
import com.sunuxam.dto.ReponseResultat;
import java.util.List;

public interface ServiceResultat {

    ReponseResultat calculerPourCandidature(Long candidatureId);


    List<ReponseResultat> calculerPourConcours(Long concoursId);


    ReponseResultat deliberer(Long candidatureId, DemandeDeliberation demande);

    void publierResultats(Long concoursId);

    List<ReponseResultat> listerParConcours(Long concoursId);


    ReponseResultat obtenirParCandidature(Long candidatureId);


    ReponseResultat obtenirPourCandidat(Long candidatureId, Long candidatId);
}
