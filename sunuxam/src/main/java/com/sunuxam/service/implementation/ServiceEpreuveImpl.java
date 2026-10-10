package com.sunuxam.service.implementation;

import com.sunuxam.depot.DepotConcours;
import com.sunuxam.depot.DepotEpreuve;
import com.sunuxam.depot.DepotNote;
import com.sunuxam.dto.DemandeEpreuve;
import com.sunuxam.dto.DemandeMiseAJourEpreuve;
import com.sunuxam.dto.ReponseEpreuve;
import com.sunuxam.exception.ExceptionMetier;
import com.sunuxam.exception.ExceptionRessourceIntrouvable;
import com.sunuxam.modele.Concours;
import com.sunuxam.modele.Epreuve;
import com.sunuxam.service.ServiceEpreuve;
import com.sunuxam.utilitaire.MappeurEpreuve;
import java.util.List;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;


@Service
@Transactional
public class ServiceEpreuveImpl implements ServiceEpreuve {

    private final DepotEpreuve depotEpreuve;
    private final DepotConcours depotConcours;
    private final DepotNote depotNote;

    public ServiceEpreuveImpl(DepotEpreuve depotEpreuve,
                              DepotConcours depotConcours,
                              DepotNote depotNote) {
        this.depotEpreuve = depotEpreuve;
        this.depotConcours = depotConcours;
        this.depotNote = depotNote;
    }

    @Override
    public ReponseEpreuve creer(DemandeEpreuve demande) {
        Concours concours = depotConcours.findById(demande.concoursId())
                .orElseThrow(() -> new ExceptionRessourceIntrouvable("Concours", demande.concoursId()));
        interdireSiResultatsPublies(concours);
        Epreuve epreuve = new Epreuve(
                demande.intitule().trim(),
                demande.description(),
                demande.coefficient(),
                demande.dureeMinutes());
        epreuve.setConcours(concours);
        return MappeurEpreuve.versReponse(depotEpreuve.save(epreuve));
    }

    @Override
    public ReponseEpreuve mettreAJour(Long id, DemandeMiseAJourEpreuve demande) {
        Epreuve epreuve = recupererEntite(id);
        interdireSiResultatsPublies(epreuve.getConcours());
        epreuve.setIntitule(demande.intitule().trim());
        epreuve.setDescription(demande.description());
        epreuve.setCoefficient(demande.coefficient());
        epreuve.setDureeMinutes(demande.dureeMinutes());
        return MappeurEpreuve.versReponse(depotEpreuve.save(epreuve));
    }

    @Override
    public void supprimer(Long id) {
        Epreuve epreuve = recupererEntite(id);
        interdireSiResultatsPublies(epreuve.getConcours());
        if (!depotNote.findByEpreuveId(id).isEmpty()) {
            throw new ExceptionMetier("Impossible de supprimer une epreuve possedant des notes");
        }
        depotEpreuve.delete(epreuve);
    }

    @Override
    @Transactional(readOnly = true)
    public List<ReponseEpreuve> listerParConcours(Long concoursId) {
        if (!depotConcours.existsById(concoursId)) {
            throw new ExceptionRessourceIntrouvable("Concours", concoursId);
        }
        return depotEpreuve.findByConcoursId(concoursId).stream()
                .map(MappeurEpreuve::versReponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public ReponseEpreuve obtenirParId(Long id) {
        return MappeurEpreuve.versReponse(recupererEntite(id));
    }

    private Epreuve recupererEntite(Long id) {
        return depotEpreuve.findById(id)
                .orElseThrow(() -> new ExceptionRessourceIntrouvable("Epreuve", id));
    }

    private void interdireSiResultatsPublies(Concours concours) {
        if (concours.isResultatsPublies()) {
            throw new ExceptionMetier(
                    "Les epreuves d'un concours dont les resultats sont publies ne sont plus modifiables");
        }
    }
}
