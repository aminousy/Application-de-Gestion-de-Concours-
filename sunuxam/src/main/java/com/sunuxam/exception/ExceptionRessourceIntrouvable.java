package com.sunuxam.exception;


public class ExceptionRessourceIntrouvable extends RuntimeException {

    public ExceptionRessourceIntrouvable(String message) {
        super(message);
    }

    public ExceptionRessourceIntrouvable(String nomRessource, Object identifiant) {
        super(nomRessource + " introuvable (identifiant : " + identifiant + ")");
    }
}
