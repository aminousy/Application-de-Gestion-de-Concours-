package com.sunuxam.exception;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.ConstraintViolationException;
import java.util.List;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.AuthenticationException;
import org.springframework.validation.FieldError;
import org.springframework.web.HttpRequestMethodNotSupportedException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.MissingServletRequestParameterException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.method.annotation.MethodArgumentTypeMismatchException;
import org.springframework.web.servlet.resource.NoResourceFoundException;


@RestControllerAdvice
public class GestionnaireExceptionGlobal {

    private static final Logger JOURNAL = LoggerFactory.getLogger(GestionnaireExceptionGlobal.class);

    @ExceptionHandler(ExceptionRessourceIntrouvable.class)
    public ResponseEntity<ReponseErreur> traiterRessourceIntrouvable(
            ExceptionRessourceIntrouvable ex, HttpServletRequest requete) {
        return construire(HttpStatus.NOT_FOUND, ex.getMessage(), requete);
    }

    @ExceptionHandler(ExceptionDonneeInvalide.class)
    public ResponseEntity<ReponseErreur> traiterDonneeInvalide(
            ExceptionDonneeInvalide ex, HttpServletRequest requete) {
        return construire(HttpStatus.BAD_REQUEST, ex.getMessage(), requete);
    }

    @ExceptionHandler(ExceptionMetier.class)
    public ResponseEntity<ReponseErreur> traiterRegleMetier(
            ExceptionMetier ex, HttpServletRequest requete) {
        return construire(HttpStatus.CONFLICT, ex.getMessage(), requete);
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ReponseErreur> traiterValidationCorps(
            MethodArgumentNotValidException ex, HttpServletRequest requete) {
        List<ReponseErreur.ErreurChamp> erreurs = ex.getBindingResult().getFieldErrors().stream()
                .map(GestionnaireExceptionGlobal::versErreurChamp)
                .toList();
        ReponseErreur corps = ReponseErreur.validation(
                HttpStatus.BAD_REQUEST.value(),
                "La validation des donnees a echoue",
                requete.getRequestURI(),
                erreurs);
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(corps);
    }

    @ExceptionHandler(ConstraintViolationException.class)
    public ResponseEntity<ReponseErreur> traiterViolationContrainte(
            ConstraintViolationException ex, HttpServletRequest requete) {
        List<ReponseErreur.ErreurChamp> erreurs = ex.getConstraintViolations().stream()
                .map(violation -> new ReponseErreur.ErreurChamp(
                        dernierNoeud(violation.getPropertyPath().toString()),
                        violation.getMessage()))
                .toList();
        ReponseErreur corps = ReponseErreur.validation(
                HttpStatus.BAD_REQUEST.value(),
                "La validation des parametres a echoue",
                requete.getRequestURI(),
                erreurs);
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(corps);
    }

    @ExceptionHandler({
            HttpMessageNotReadableException.class,
            MethodArgumentTypeMismatchException.class,
            MissingServletRequestParameterException.class})
    public ResponseEntity<ReponseErreur> traiterRequeteMalFormee(
            Exception ex, HttpServletRequest requete) {
        return construire(HttpStatus.BAD_REQUEST,
                "Requete mal formee ou parametre invalide", requete);
    }

    @ExceptionHandler(HttpRequestMethodNotSupportedException.class)
    public ResponseEntity<ReponseErreur> traiterMethodeNonSupportee(
            HttpRequestMethodNotSupportedException ex, HttpServletRequest requete) {
        return construire(HttpStatus.METHOD_NOT_ALLOWED,
                "Methode HTTP non supportee pour cette ressource", requete);
    }

    @ExceptionHandler(NoResourceFoundException.class)
    public ResponseEntity<ReponseErreur> traiterCheminInconnu(
            NoResourceFoundException ex, HttpServletRequest requete) {
        return construire(HttpStatus.NOT_FOUND, "Ressource introuvable", requete);
    }

    @ExceptionHandler(AccessDeniedException.class)
    public ResponseEntity<ReponseErreur> traiterAccesRefuse(
            AccessDeniedException ex, HttpServletRequest requete) {
        return construire(HttpStatus.FORBIDDEN, "Acces refuse", requete);
    }

    @ExceptionHandler(AuthenticationException.class)
    public ResponseEntity<ReponseErreur> traiterAuthentification(
            AuthenticationException ex, HttpServletRequest requete) {
        return construire(HttpStatus.UNAUTHORIZED,
                "Authentification requise ou invalide", requete);
    }

    @ExceptionHandler(DataIntegrityViolationException.class)
    public ResponseEntity<ReponseErreur> traiterIntegrite(
            DataIntegrityViolationException ex, HttpServletRequest requete) {
        JOURNAL.warn("Violation d'integrite des donnees : {}", ex.getMostSpecificCause().getMessage());
        return construire(HttpStatus.CONFLICT,
                "L'operation viole une contrainte d'integrite des donnees", requete);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ReponseErreur> traiterErreurInattendue(
            Exception ex, HttpServletRequest requete) {
        JOURNAL.error("Erreur inattendue sur {}", requete.getRequestURI(), ex);
        return construire(HttpStatus.INTERNAL_SERVER_ERROR,
                "Une erreur interne est survenue", requete);
    }

    private static ReponseErreur.ErreurChamp versErreurChamp(FieldError erreur) {
        return new ReponseErreur.ErreurChamp(erreur.getField(), erreur.getDefaultMessage());
    }

    private static String dernierNoeud(String chemin) {
        int position = chemin.lastIndexOf('.');
        return position >= 0 ? chemin.substring(position + 1) : chemin;
    }

    private static ResponseEntity<ReponseErreur> construire(
            HttpStatus statut, String message, HttpServletRequest requete) {
        ReponseErreur corps = ReponseErreur.simple(
                statut.value(), message, requete.getRequestURI());
        return ResponseEntity.status(statut).body(corps);
    }
}
