package com.sunuxam.exception;

/**
  Levee lorsqu'une donnee fournie est syntaxiquement correcte mais
 incoherente correspond au code HTTP 400.
 */
public class ExceptionDonneeInvalide extends RuntimeException {

    public ExceptionDonneeInvalide(String message) {
        super(message);
    }
}
