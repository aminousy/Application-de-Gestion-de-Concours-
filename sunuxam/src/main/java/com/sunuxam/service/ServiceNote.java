package com.sunuxam.service;

import com.sunuxam.dto.DemandeNote;
import com.sunuxam.dto.ReponseNote;
import java.util.List;


public interface ServiceNote {

    /** Cree la note si elle n'existe pas, sinon met a jour sa valeur */
    ReponseNote saisir(DemandeNote demande);

    List<ReponseNote> listerParCandidature(Long candidatureId);

    /** Consultation des notes */
    List<ReponseNote> listerParCandidaturePourCandidat(Long candidatureId, Long candidatId);

    void supprimer(Long id);
}
