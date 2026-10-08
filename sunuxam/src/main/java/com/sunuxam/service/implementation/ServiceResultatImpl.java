package com.sunuxam.service.implementation;

import com.sunuxam.depot.DepotCandidature;
import com.sunuxam.depot.DepotConcours;
import com.sunuxam.depot.DepotEpreuve;
import com.sunuxam.depot.DepotNote;
import com.sunuxam.depot.DepotResultat;
import com.sunuxam.dto.DemandeDeliberation;
import com.sunuxam.dto.ReponseResultat;
import com.sunuxam.exception.ExceptionMetier;
import com.sunuxam.exception.ExceptionRessourceIntrouvable;
import com.sunuxam.modele.Candidature;
import com.sunuxam.modele.Concours;
import com.sunuxam.modele.Epreuve;
import com.sunuxam.modele.Note;
import com.sunuxam.modele.Resultat;
import com.sunuxam.modele.StatutCandidature;
import com.sunuxam.service.ServiceResultat;
import com.sunuxam.utilitaire.CalculateurMoyenne;
import com.sunuxam.utilitaire.MappeurResultat;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Implementation des operations de calcul, de deliberation et de publication
 * des resultats.
 */
@Service
@Transactional
public class ServiceResultatImpl implements ServiceResultat {

    private final DepotResultat depotResultat;
    private final DepotCandidature depotCandidature;
    private final DepotNote depotNote;
    private final DepotEpreuve depotEpreuve;
    private final DepotConcours depotConcours;

    public ServiceResultatImpl(DepotResultat depotResultat,
                               DepotCandidature depotCandidature,
                               DepotNote depotNote,
                               DepotEpreuve depotEpreuve,
                               DepotConcours depotConcours) {
        this.depotResultat = depotResultat;
        this.depotCandidature = depotCandidature;
        this.depotNote = depotNote;
        this.depotEpreuve = depotEpreuve;
        this.depotConcours = depotConcours;
    }

    @Override
    public ReponseResultat calculerPourCandidature(Long candidatureId) {
        Candidature candidature = depotCandidature.findById(candidatureId)
                .orElseThrow(() -> new ExceptionRessourceIntrouvable("Candidature", candidatureId));
        return MappeurResultat.versReponse(calculerEtEnregistrer(candidature));
    }

    @Override
    public List<ReponseResultat> calculerPourConcours(Long concoursId) {
        Concours concours = depotConcours.findById(concoursId)
                .orElseThrow(() -> new ExceptionRessourceIntrouvable("Concours", concoursId));
        List<Candidature> candidatures = depotCandidature.findByConcoursId(concoursId);
        if (candidatures.isEmpty()) {
            throw new ExceptionMetier("Aucune candidature n'a ete deposee pour ce concours");
        }

        List<Resultat> resultats = new ArrayList<>();
        for (Candidature candidature : candidatures) {
            resultats.add(calculerEtEnregistrer(candidature));
        }
        resultats.sort(Comparator.comparingDouble(Resultat::getMoyenne).reversed());

        int rang = 1;
        for (Resultat resultat : resultats) {
            resultat.setRang(rang);
            resultat.setAdmis(rang <= concours.getNombrePlaces());
            depotResultat.save(resultat);
            rang++;
        }
        return resultats.stream().map(MappeurResultat::versReponse).toList();
    }

    @Override
    public ReponseResultat deliberer(Long candidatureId, DemandeDeliberation demande) {
        Resultat resultat = depotResultat.findByCandidatureId(candidatureId)
                .orElseThrow(() -> new ExceptionRessourceIntrouvable(
                        "Resultat", "candidature " + candidatureId));
        if (demande.admis() != null) {
            resultat.setAdmis(demande.admis());
        }
        if (demande.decision() != null) {
            resultat.setDecision(demande.decision());
        }
        Candidature candidature = resultat.getCandidature();
        candidature.setStatut(resultat.isAdmis()
                ? StatutCandidature.ADMIS
                : StatutCandidature.REFUSE);
        depotCandidature.save(candidature);
        return MappeurResultat.versReponse(depotResultat.save(resultat));
    }

    @Override
    public void publierResultats(Long concoursId) {
        Concours concours = depotConcours.findById(concoursId)
                .orElseThrow(() -> new ExceptionRessourceIntrouvable("Concours", concoursId));
        if (depotResultat.findByCandidature_ConcoursId(concoursId).isEmpty()) {
            throw new ExceptionMetier("Aucun resultat n'a ete calcule pour ce concours");
        }
        concours.setResultatsPublies(true);
        concours.setDatePublicationResultats(LocalDateTime.now());
        depotConcours.save(concours);
    }

    @Override
    @Transactional(readOnly = true)
    public List<ReponseResultat> listerParConcours(Long concoursId) {
        if (!depotConcours.existsById(concoursId)) {
            throw new ExceptionRessourceIntrouvable("Concours", concoursId);
        }
        return depotResultat.findByCandidature_ConcoursIdOrderByMoyenneDesc(concoursId).stream()
                .map(MappeurResultat::versReponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public ReponseResultat obtenirParCandidature(Long candidatureId) {
        Resultat resultat = depotResultat.findByCandidatureId(candidatureId)
                .orElseThrow(() -> new ExceptionRessourceIntrouvable(
                        "Resultat", "candidature " + candidatureId));
        return MappeurResultat.versReponse(resultat);
    }

    @Override
    @Transactional(readOnly = true)
    public ReponseResultat obtenirPourCandidat(Long candidatureId, Long candidatId) {
        Candidature candidature = depotCandidature.findById(candidatureId)
                .orElseThrow(() -> new ExceptionRessourceIntrouvable("Candidature", candidatureId));
        if (!candidature.getCandidat().getId().equals(candidatId)) {
            throw new AccessDeniedException("Acces refuse a ce resultat");
        }
        if (!candidature.getConcours().isResultatsPublies()) {
            throw new ExceptionMetier("Les resultats de ce concours ne sont pas encore publies");
        }
        Resultat resultat = depotResultat.findByCandidatureId(candidatureId)
                .orElseThrow(() -> new ExceptionRessourceIntrouvable(
                        "Resultat", "candidature " + candidatureId));
        return MappeurResultat.versReponse(resultat);
    }

    /**
     * Calcule la moyenne ponderee d'une candidature apres avoir verifie que
     * toutes les notes sont saisies, puis cree ou met a jour son resultat.
     */
    private Resultat calculerEtEnregistrer(Candidature candidature) {
        List<Epreuve> epreuves = depotEpreuve.findByConcoursId(candidature.getConcours().getId());
        if (epreuves.isEmpty()) {
            throw new ExceptionMetier("Le concours ne comporte aucune epreuve");
        }
        List<Note> notes = depotNote.findByCandidatureId(candidature.getId());
        if (notes.size() < epreuves.size()) {
            throw new ExceptionMetier(
                    "Toutes les notes ne sont pas saisies pour la candidature " + candidature.getId());
        }

        double moyenne = CalculateurMoyenne.moyennePonderee(notes);
        Resultat resultat = depotResultat.findByCandidatureId(candidature.getId())
                .orElseGet(Resultat::new);
        resultat.setCandidature(candidature);
        resultat.setMoyenne(moyenne);

        if (candidature.getStatut() == StatutCandidature.EN_ATTENTE
                || candidature.getStatut() == StatutCandidature.DOSSIER_COMPLET) {
            candidature.setStatut(StatutCandidature.EN_ATTENTE_DE_DELIBERATION);
            depotCandidature.save(candidature);
        }
        return depotResultat.save(resultat);
    }
}
