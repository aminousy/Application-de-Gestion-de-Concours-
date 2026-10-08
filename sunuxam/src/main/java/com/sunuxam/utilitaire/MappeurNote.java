package com.sunuxam.utilitaire;

import com.sunuxam.dto.ReponseNote;
import com.sunuxam.modele.Epreuve;
import com.sunuxam.modele.Note;

/**
 * Conversion des notes vers leur DTO.
 */
public final class MappeurNote {

    private MappeurNote() {
    }

    public static ReponseNote versReponse(Note note) {
        Epreuve epreuve = note.getEpreuve();
        return new ReponseNote(
                note.getId(),
                note.getCandidature().getId(),
                epreuve.getId(),
                epreuve.getIntitule(),
                epreuve.getCoefficient(),
                note.getValeur(),
                note.getDateSaisie());
    }
}
