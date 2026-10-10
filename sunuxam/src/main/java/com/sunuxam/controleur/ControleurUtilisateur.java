package com.sunuxam.controleur;

import com.sunuxam.dto.DemandeAdministrationUtilisateur;
import com.sunuxam.dto.DemandeChangementMotDePasse;
import com.sunuxam.dto.DemandeCreationUtilisateur;
import com.sunuxam.dto.DemandeMiseAJourUtilisateur;
import com.sunuxam.dto.ReponseUtilisateur;
import com.sunuxam.modele.Role;
import com.sunuxam.securite.UtilisateurDetails;
import com.sunuxam.service.ServiceUtilisateur;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;


@RestController
@RequestMapping("/api/utilisateurs")
@Tag(name = "Utilisateurs", description = "Gestion des comptes utilisateurs")
public class ControleurUtilisateur {

    private final ServiceUtilisateur serviceUtilisateur;

    public ControleurUtilisateur(ServiceUtilisateur serviceUtilisateur) {
        this.serviceUtilisateur = serviceUtilisateur;
    }


    @GetMapping("/moi")
    @Operation(summary = "Consulter son propre profil")
    public ReponseUtilisateur monProfil(@AuthenticationPrincipal UtilisateurDetails utilisateur) {
        return serviceUtilisateur.obtenirParId(utilisateur.getId());
    }

    @PutMapping("/moi")
    @Operation(summary = "Mettre a jour son propre profil")
    public ReponseUtilisateur mettreAJourMonProfil(
            @AuthenticationPrincipal UtilisateurDetails utilisateur,
            @Valid @RequestBody DemandeMiseAJourUtilisateur demande) {
        return serviceUtilisateur.mettreAJourProfil(utilisateur.getId(), demande);
    }

    @PatchMapping("/moi/mot-de-passe")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @Operation(summary = "Changer son propre mot de passe")
    public void changerMonMotDePasse(
            @AuthenticationPrincipal UtilisateurDetails utilisateur,
            @Valid @RequestBody DemandeChangementMotDePasse demande) {
        serviceUtilisateur.changerMotDePasse(utilisateur.getId(), demande);
    }


    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Lister les utilisateurs, filtrables par role")
    public List<ReponseUtilisateur> lister(@RequestParam(required = false) Role role) {
        return role == null
                ? serviceUtilisateur.listerTous()
                : serviceUtilisateur.listerParRole(role);
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Consulter un utilisateur par son identifiant")
    public ReponseUtilisateur obtenir(@PathVariable Long id) {
        return serviceUtilisateur.obtenirParId(id);
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    @ResponseStatus(HttpStatus.CREATED)
    @Operation(summary = "Creer un utilisateur avec un role impose")
    public ReponseUtilisateur creer(@Valid @RequestBody DemandeCreationUtilisateur demande) {
        return serviceUtilisateur.creer(demande);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Mettre a jour le profil d'un utilisateur")
    public ReponseUtilisateur mettreAJour(@PathVariable Long id,
                                          @Valid @RequestBody DemandeMiseAJourUtilisateur demande) {
        return serviceUtilisateur.mettreAJourProfil(id, demande);
    }

    @PatchMapping("/{id}/administration")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Modifier le role et/ou l'etat d'activation d'un utilisateur")
    public ReponseUtilisateur administrer(@PathVariable Long id,
                                          @Valid @RequestBody DemandeAdministrationUtilisateur demande) {
        return serviceUtilisateur.administrer(id, demande);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @Operation(summary = "Supprimer un utilisateur")
    public void supprimer(@PathVariable Long id) {
        serviceUtilisateur.supprimer(id);
    }
}
