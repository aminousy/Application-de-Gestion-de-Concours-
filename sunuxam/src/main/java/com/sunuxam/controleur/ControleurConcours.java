package com.sunuxam.controleur;

import com.sunuxam.dto.DemandeConcours;
import com.sunuxam.dto.ReponseConcours;
import com.sunuxam.dto.ReponseConcoursDetail;
import com.sunuxam.service.ServiceConcours;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
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

/**
 * Ressource de gestion des concours.
 */
@RestController
@RequestMapping("/api/concours")
@Tag(name = "Concours", description = "Gestion des concours et examens")
public class ControleurConcours {

    private final ServiceConcours serviceConcours;

    public ControleurConcours(ServiceConcours serviceConcours) {
        this.serviceConcours = serviceConcours;
    }


    @GetMapping("/ouverts")
    @Operation(summary = "Lister les concours ouverts aux candidatures")
    public List<ReponseConcours> listerOuverts() {
        return serviceConcours.listerOuverts();
    }

    @GetMapping("/{id}")
    @Operation(summary = "Consulter le detail d'un concours et de ses epreuves")
    public ReponseConcoursDetail obtenir(@PathVariable Long id) {
        return serviceConcours.obtenirDetail(id);
    }

    // ------------------------------------------------------------------
    // Administration (ROLE_ADMIN)
    // ------------------------------------------------------------------

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Lister tous les concours")
    public List<ReponseConcours> listerTous() {
        return serviceConcours.listerTous();
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    @ResponseStatus(HttpStatus.CREATED)
    @Operation(summary = "Creer un concours")
    public ReponseConcours creer(@Valid @RequestBody DemandeConcours demande) {
        return serviceConcours.creer(demande);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Mettre a jour un concours")
    public ReponseConcours mettreAJour(@PathVariable Long id,
                                       @Valid @RequestBody DemandeConcours demande) {
        return serviceConcours.mettreAJour(id, demande);
    }

    @PatchMapping("/{id}/ouverture")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Ouvrir ou fermer un concours aux candidatures")
    public ReponseConcours definirOuverture(@PathVariable Long id,
                                            @RequestParam boolean ouvert) {
        return serviceConcours.definirOuverture(id, ouvert);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @Operation(summary = "Supprimer un concours")
    public void supprimer(@PathVariable Long id) {
        serviceConcours.supprimer(id);
    }
}
