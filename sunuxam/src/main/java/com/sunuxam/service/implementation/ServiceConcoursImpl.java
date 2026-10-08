package com.sunuxam.service.implementation;

import com.sunuxam.depot.DepotCandidature;
import com.sunuxam.depot.DepotConcours;
import com.sunuxam.depot.DepotEpreuve;
import com.sunuxam.dto.DemandeConcours;
import com.sunuxam.dto.ReponseConcours;
import com.sunuxam.dto.ReponseConcoursDetail;
import com.sunuxam.exception.ExceptionDonneeInvalide;
import com.sunuxam.exception.ExceptionMetier;
import com.sunuxam.exception.ExceptionRessourceIntrouvable;
import com.sunuxam.modele.Concours;
import com.sunuxam.service.ServiceConcours;
import com.sunuxam.utilitaire.MappeurConcours;
import java.util.List;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Implementation des operations de gestion des concours.
 */
@Service
@Transactional
public class ServiceConcoursImpl implements ServiceConcours {

    private final DepotConcours depotConcours;
    private final DepotEpreuve depotEpreuve;
    private final DepotCandidature depotCandidature;

    public ServiceConcoursImpl(DepotConcours depotConcours,
                               DepotEpreuve depotEpreuve,
                               DepotCandidature depotCandidature) {
        this.depotConcours = depotConcours;
        this.depotEpreuve = depotEpreuve;
        this.depotCandidature = depotCandidature;
    }

    @Override
    public ReponseConcours creer(DemandeConcours demande) {
        validerCoherenceDates(demande);
        Concours concours = new Concours(
                demande.titre().trim(),
                demande.description(),
                demande.dateLimiteCandidature(),
                demande.dateDeliberation(),
                demande.nombrePlaces());
        concours.setOuvert(demande.ouvert());
        Concours enregistre = depotConcours.save(concours);
        return MappeurConcours.versReponse(enregistre, 0L);
    }

    @Override
    public ReponseConcours mettreAJour(Long id, DemandeConcours demande) {
        validerCoherenceDates(demande);
        Concours concours = recupererEntite(id);
        if (concours.isResultatsPublies()) {
            throw new ExceptionMetier(
                    "Un concours dont les resultats sont publies ne peut plus etre modifie");
        }
        concours.setTitre(demande.titre().trim());
        concours.setDescription(demande.description());
        concours.setDateLimiteCandidature(demande.dateLimiteCandidature());
        concours.setDateDeliberation(demande.dateDeliberation());
        concours.setNombrePlaces(demande.nombrePlaces());
        concours.setOuvert(demande.ouvert());
        Concours enregistre = depotConcours.save(concours);
        return MappeurConcours.versReponse(enregistre, depotEpreuve.countByConcoursId(id));
    }

    @Override
    public void supprimer(Long id) {
        Concours concours = recupererEntite(id);
        if (!depotCandidature.findByConcoursId(id).isEmpty()) {
            throw new ExceptionMetier("Impossible de supprimer un concours ayant des candidatures");
        }
        depotConcours.delete(concours);
    }

    @Override
    @Transactional(readOnly = true)
    public List<ReponseConcours> listerTous() {
        return depotConcours.findAll().stream()
                .map(concours -> MappeurConcours.versReponse(
                        concours, depotEpreuve.countByConcoursId(concours.getId())))
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<ReponseConcours> listerOuverts() {
        return depotConcours.findByOuvertTrue().stream()
                .map(concours -> MappeurConcours.versReponse(
                        concours, depotEpreuve.countByConcoursId(concours.getId())))
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public ReponseConcoursDetail obtenirDetail(Long id) {
        return MappeurConcours.versDetail(recupererEntite(id));
    }

    @Override
    public ReponseConcours definirOuverture(Long id, boolean ouvert) {
        Concours concours = recupererEntite(id);
        concours.setOuvert(ouvert);
        Concours enregistre = depotConcours.save(concours);
        return MappeurConcours.versReponse(enregistre, depotEpreuve.countByConcoursId(id));
    }

    private Concours recupererEntite(Long id) {
        return depotConcours.findById(id)
                .orElseThrow(() -> new ExceptionRessourceIntrouvable("Concours", id));
    }

    private void validerCoherenceDates(DemandeConcours demande) {
        if (demande.dateDeliberation() != null
                && demande.dateDeliberation().isBefore(demande.dateLimiteCandidature())) {
            throw new ExceptionDonneeInvalide(
                    "La date de deliberation ne peut pas preceder la date limite de candidature");
        }
    }
}
