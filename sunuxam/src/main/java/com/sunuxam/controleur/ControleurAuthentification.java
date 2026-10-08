package com.sunuxam.controleur;

import com.sunuxam.dto.DemandeConnexion;
import com.sunuxam.dto.DemandeInscription;
import com.sunuxam.dto.ReponseAuthentification;
import com.sunuxam.service.ServiceAuthentification;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirements;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;


@RestController
@RequestMapping("/api/authentification")
@Tag(name = "Authentification", description = "Inscription des candidats et connexion")
@SecurityRequirements
public class ControleurAuthentification {

    private final ServiceAuthentification serviceAuthentification;

    public ControleurAuthentification(ServiceAuthentification serviceAuthentification) {
        this.serviceAuthentification = serviceAuthentification;
    }

    @PostMapping("/inscription")
    @ResponseStatus(HttpStatus.CREATED)
    @Operation(summary = "Inscrire un nouveau candidat et obtenir un jeton d'acces")
    public ReponseAuthentification inscrire(@Valid @RequestBody DemandeInscription demande) {
        return serviceAuthentification.inscrire(demande);
    }

    @PostMapping("/connexion")
    @Operation(summary = "Se connecter avec un email et un mot de passe et obtenir un jeton d'acces")
    public ReponseAuthentification connecter(@Valid @RequestBody DemandeConnexion demande) {
        return serviceAuthentification.connecter(demande);
    }
}
