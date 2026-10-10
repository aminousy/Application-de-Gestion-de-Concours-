package com.sunuxam.controleur;

import com.sunuxam.dto.DemandeCandidature;
import com.sunuxam.dto.DemandeChangementStatutCandidature;
import com.sunuxam.dto.ReponseCandidature;
import com.sunuxam.modele.StatutCandidature;
import com.sunuxam.securite.UtilisateurDetails;
import com.sunuxam.service.ServiceCandidature;
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
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;


@RestController
@RequestMapping("/api/candidatures")
@Tag(name = "Candidatures", description = "Depot et suivi des candidatures")
public class ControleurCandidature {

    private final ServiceCandidature serviceCandidature;

    public ControleurCandidature(ServiceCandidature serviceCandidature) {
        this.serviceCandidature = serviceCandidature;
    }


    @PostMapping
    @PreAuthorize("hasRole('CANDIDAT')")
    @ResponseStatus(HttpStatus.CREATED)
    @Operation(summary = "Deposer une candidature a un concours")
    public ReponseCandidature deposer(@AuthenticationPrincipal UtilisateurDetails utilisateur,
                                      @Valid @RequestBody DemandeCandidature demande) {
        return serviceCandidature.deposer(utilisateur.getId(), demande);
    }

    @GetMapping("/mes")
    @PreAuthorize("hasRole('CANDIDAT')")
    @Operation(summary = "Lister ses propres candidatures")
    public List<ReponseCandidature> mesCandidatures(
            @AuthenticationPrincipal UtilisateurDetails utilisateur) {
        return serviceCandidature.listerMesCandidatures(utilisateur.getId());
    }


    @GetMapping("/{id}")
    @Operation(summary = "Consulter une candidature (la sienne pour un candidat)")
    public ReponseCandidature obtenir(@PathVariable Long id,
                                      @AuthenticationPrincipal UtilisateurDetails utilisateur) {
        return utilisateur.estAdministrateur()
                ? serviceCandidature.obtenirParId(id)
                : serviceCandidature.obtenirPourCandidat(id, utilisateur.getId());
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @Operation(summary = "Supprimer (admin) ou retirer (candidat) une candidature")
    public void supprimer(@PathVariable Long id,
                          @AuthenticationPrincipal UtilisateurDetails utilisateur) {
        if (utilisateur.estAdministrateur()) {
            serviceCandidature.supprimer(id);
        } else {
            serviceCandidature.retirerParCandidat(id, utilisateur.getId());
        }
    }




    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Lister les candidatures d'un concours, filtrables par statut")
    public List<ReponseCandidature> listerParConcours(
            @RequestParam Long concoursId,
            @RequestParam(required = false) StatutCandidature statut) {
        return statut == null
                ? serviceCandidature.listerParConcours(concoursId)
                : serviceCandidature.listerParConcoursEtStatut(concoursId, statut);
    }

    @PatchMapping("/{id}/statut")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Changer le statut d'une candidature")
    public ReponseCandidature changerStatut(
            @PathVariable Long id,
            @Valid @RequestBody DemandeChangementStatutCandidature demande) {
        return serviceCandidature.changerStatut(id, demande);
    }
}
