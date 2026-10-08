package com.sunuxam.exception;

import java.time.LocalDateTime;
import java.util.List;


public record ReponseErreur(

        int statut,

        String message,

        LocalDateTime date,

        String chemin,

        List<ErreurChamp> erreurs) {

    public record ErreurChamp(String champ, String message) {
    }

    /** Construit une reponse d'erreur   */
    public static ReponseErreur simple(int statut, String message, String chemin) {
        return new ReponseErreur(statut, message, LocalDateTime.now(), chemin, null);
    }

    public static ReponseErreur validation(int statut, String message, String chemin,
                                           List<ErreurChamp> erreurs) {
        return new ReponseErreur(statut, message, LocalDateTime.now(), chemin, erreurs);
    }
}
