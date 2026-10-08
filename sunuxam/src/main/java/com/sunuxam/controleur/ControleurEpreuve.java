package com.sunuxam.controleur;

import com.sunuxam.dto.DemandeEpreuve;
import com.sunuxam.dto.DemandeMiseAJourEpreuve;
import com.sunuxam.dto.ReponseEpreuve;
import com.sunuxam.service.ServiceEpreuve;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

/**
 * Ressource de gestion des epreuves.
 */
@RestController
@RequestMapping("/api/epreuves")
@Tag(name = "Epreuves", description = "Gestion des epreuves des concours")
public class ControleurEpreuve {

    private final ServiceEpreuve serviceEpreuve;

    public ControleurEpreuve(ServiceEpreuve serviceEpreuve) {
        this.serviceEpreuve = serviceEpreuve;
    }



    @GetMapping
    @Operation(summary = "Lister les epreuves d'un concours")
    public List<ReponseEpreuve> listerParConcours(@RequestParam Long concoursId) {
        return serviceEpreuve.listerParConcours(concoursId);
    }

    @GetMapping("/{id}")
    @Operation(summary = "Consulter une epreuve")
    public ReponseEpreuve obtenir(@PathVariable Long id) {
        return serviceEpreuve.obtenirParId(id);
    }


    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    @ResponseStatus(HttpStatus.CREATED)
    @Operation(summary = "Creer une epreuve rattachee a un concours")
    public ReponseEpreuve creer(@Valid @RequestBody DemandeEpreuve demande) {
        return serviceEpreuve.creer(demande);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Mettre a jour une epreuve")
    public ReponseEpreuve mettreAJour(@PathVariable Long id,
                                      @Valid @RequestBody DemandeMiseAJourEpreuve demande) {
        return serviceEpreuve.mettreAJour(id, demande);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @Operation(summary = "Supprimer une epreuve")
    public void supprimer(@PathVariable Long id) {
        serviceEpreuve.supprimer(id);
    }
}
