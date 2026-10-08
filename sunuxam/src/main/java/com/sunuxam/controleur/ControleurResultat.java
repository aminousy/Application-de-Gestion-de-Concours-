package com.sunuxam.controleur;

import com.sunuxam.dto.DemandeDeliberation;
import com.sunuxam.dto.ReponseResultat;
import com.sunuxam.securite.UtilisateurDetails;
import com.sunuxam.service.ServiceResultat;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;


@RestController
@RequestMapping("/api/resultats")
@Tag(name = "Resultats", description = "Calcul, deliberation, publication et consultation des resultats")
public class ControleurResultat {

    private final ServiceResultat serviceResultat;

    public ControleurResultat(ServiceResultat serviceResultat) {
        this.serviceResultat = serviceResultat;
    }


    @PostMapping("/concours/{concoursId}/calcul")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Calculer les resultats d'un concours et etablir le classement")
    public List<ReponseResultat> calculerPourConcours(@PathVariable Long concoursId) {
        return serviceResultat.calculerPourConcours(concoursId);
    }

    @PostMapping("/candidatures/{candidatureId}/calcul")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Calculer le resultat d'une candidature")
    public ReponseResultat calculerPourCandidature(@PathVariable Long candidatureId) {
        return serviceResultat.calculerPourCandidature(candidatureId);
    }

    @PatchMapping("/candidatures/{candidatureId}/deliberation")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Appliquer une decision de jury a une candidature")
    public ReponseResultat deliberer(@PathVariable Long candidatureId,
                                     @Valid @RequestBody DemandeDeliberation demande) {
        return serviceResultat.deliberer(candidatureId, demande);
    }


    @PostMapping("/concours/{concoursId}/publication")
    @PreAuthorize("hasRole('ADMIN')")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @Operation(summary = "Publier les resultats d'un concours (les rendre visibles des candidats)")
    public void publier(@PathVariable Long concoursId) {
        serviceResultat.publierResultats(concoursId);
    }


    @GetMapping("/concours/{concoursId}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Lister les resultats d'un concours (classement par moyenne)")
    public List<ReponseResultat> listerParConcours(@PathVariable Long concoursId) {
        return serviceResultat.listerParConcours(concoursId);
    }

    @GetMapping("/candidatures/{candidatureId}")
    @Operation(summary = "Consulter le resultat d'une candidature (le sien pour un candidat, apres publication)")
    public ReponseResultat obtenirParCandidature(
            @PathVariable Long candidatureId,
            @AuthenticationPrincipal UtilisateurDetails utilisateur) {
        return utilisateur.estAdministrateur()
                ? serviceResultat.obtenirParCandidature(candidatureId)
                : serviceResultat.obtenirPourCandidat(candidatureId, utilisateur.getId());
    }
}
