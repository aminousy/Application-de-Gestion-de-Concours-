package com.sunuxam.exception;

/**
 * Levee lorsqu'une ressource demandee n'existe pas. Correspond au code HTTP 404.
 */
public class ExceptionRessourceIntrouvable extends RuntimeException {

    public ExceptionRessourceIntrouvable(String message) {
        super(message);
    }

    public ExceptionRessourceIntrouvable(String nomRessource, Object identifiant) {
        super(nomRessource + " introuvable (identifiant : " + identifiant + ")");
    }
}
