package com.sunuxam.service;

import com.sunuxam.dto.DemandeNote;
import com.sunuxam.dto.ReponseNote;
import java.util.List;


public interface ServiceNote {


    ReponseNote saisir(DemandeNote demande);

    List<ReponseNote> listerParCandidature(Long candidatureId);


    List<ReponseNote> listerParCandidaturePourCandidat(Long candidatureId, Long candidatId);

    void supprimer(Long id);
}
