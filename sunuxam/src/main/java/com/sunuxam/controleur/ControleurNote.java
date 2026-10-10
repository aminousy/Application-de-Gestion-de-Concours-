package com.sunuxam.controleur;

import com.sunuxam.dto.DemandeNote;
import com.sunuxam.dto.ReponseNote;
import com.sunuxam.securite.UtilisateurDetails;
import com.sunuxam.service.ServiceNote;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;


@RestController
@RequestMapping("/api/notes")
@Tag(name = "Notes", description = "Saisie et consultation des notes")
public class ControleurNote {

    private final ServiceNote serviceNote;

    public ControleurNote(ServiceNote serviceNote) {
        this.serviceNote = serviceNote;
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Saisir ou mettre a jour une note pour une candidature et une epreuve")
    public ReponseNote saisir(@Valid @RequestBody DemandeNote demande) {
        return serviceNote.saisir(demande);
    }

    @GetMapping
    @Operation(summary = "Lister les notes d'une candidature (les siennes pour un candidat)")
    public List<ReponseNote> lister(@RequestParam Long candidatureId,
                                    @AuthenticationPrincipal UtilisateurDetails utilisateur) {
        return utilisateur.estAdministrateur()
                ? serviceNote.listerParCandidature(candidatureId)
                : serviceNote.listerParCandidaturePourCandidat(candidatureId, utilisateur.getId());
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @Operation(summary = "Supprimer une note")
    public void supprimer(@PathVariable Long id) {
        serviceNote.supprimer(id);
    }
}
