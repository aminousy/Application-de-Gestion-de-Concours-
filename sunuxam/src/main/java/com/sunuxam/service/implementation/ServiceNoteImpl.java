package com.sunuxam.service.implementation;

import com.sunuxam.depot.DepotCandidature;
import com.sunuxam.depot.DepotEpreuve;
import com.sunuxam.depot.DepotNote;
import com.sunuxam.dto.DemandeNote;
import com.sunuxam.dto.ReponseNote;
import com.sunuxam.exception.ExceptionDonneeInvalide;
import com.sunuxam.exception.ExceptionMetier;
import com.sunuxam.exception.ExceptionRessourceIntrouvable;
import com.sunuxam.modele.Candidature;
import com.sunuxam.modele.Epreuve;
import com.sunuxam.modele.Note;
import com.sunuxam.service.ServiceNote;
import com.sunuxam.utilitaire.MappeurNote;
import java.util.List;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Implementation des operations de saisie et de consultation des notes.
 */
@Service
@Transactional
public class ServiceNoteImpl implements ServiceNote {

    private final DepotNote depotNote;
    private final DepotCandidature depotCandidature;
    private final DepotEpreuve depotEpreuve;

    public ServiceNoteImpl(DepotNote depotNote,
                           DepotCandidature depotCandidature,
                           DepotEpreuve depotEpreuve) {
        this.depotNote = depotNote;
        this.depotCandidature = depotCandidature;
        this.depotEpreuve = depotEpreuve;
    }

    @Override
    public ReponseNote saisir(DemandeNote demande) {
        Candidature candidature = depotCandidature.findById(demande.candidatureId())
                .orElseThrow(() -> new ExceptionRessourceIntrouvable("Candidature", demande.candidatureId()));
        Epreuve epreuve = depotEpreuve.findById(demande.epreuveId())
                .orElseThrow(() -> new ExceptionRessourceIntrouvable("Epreuve", demande.epreuveId()));

        if (!epreuve.getConcours().getId().equals(candidature.getConcours().getId())) {
            throw new ExceptionDonneeInvalide(
                    "L'epreuve n'appartient pas au concours de la candidature");
        }
        if (candidature.getConcours().isResultatsPublies()) {
            throw new ExceptionMetier(
                    "Les resultats du concours sont publies : les notes ne sont plus modifiables");
        }

        Note note = depotNote
                .findByCandidatureIdAndEpreuveId(candidature.getId(), epreuve.getId())
                .orElseGet(Note::new);
        note.setCandidature(candidature);
        note.setEpreuve(epreuve);
        note.setValeur(demande.valeur());
        return MappeurNote.versReponse(depotNote.save(note));
    }

    @Override
    @Transactional(readOnly = true)
    public List<ReponseNote> listerParCandidature(Long candidatureId) {
        if (!depotCandidature.existsById(candidatureId)) {
            throw new ExceptionRessourceIntrouvable("Candidature", candidatureId);
        }
        return depotNote.findByCandidatureId(candidatureId).stream()
                .map(MappeurNote::versReponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<ReponseNote> listerParCandidaturePourCandidat(Long candidatureId, Long candidatId) {
        Candidature candidature = depotCandidature.findById(candidatureId)
                .orElseThrow(() -> new ExceptionRessourceIntrouvable("Candidature", candidatureId));
        if (!candidature.getCandidat().getId().equals(candidatId)) {
            throw new AccessDeniedException("Acces refuse aux notes de cette candidature");
        }
        return depotNote.findByCandidatureId(candidatureId).stream()
                .map(MappeurNote::versReponse)
                .toList();
    }

    @Override
    public void supprimer(Long id) {
        Note note = depotNote.findById(id)
                .orElseThrow(() -> new ExceptionRessourceIntrouvable("Note", id));
        if (note.getCandidature().getConcours().isResultatsPublies()) {
            throw new ExceptionMetier(
                    "Les resultats du concours sont publies : les notes ne sont plus modifiables");
        }
        depotNote.delete(note);
    }
}
