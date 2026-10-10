package com.sunuxam.service.implementation;

import com.sunuxam.depot.DepotCandidature;
import com.sunuxam.depot.DepotConcours;
import com.sunuxam.depot.DepotUtilisateur;
import com.sunuxam.dto.DemandeCandidature;
import com.sunuxam.dto.DemandeChangementStatutCandidature;
import com.sunuxam.dto.ReponseCandidature;
import com.sunuxam.exception.ExceptionMetier;
import com.sunuxam.exception.ExceptionRessourceIntrouvable;
import com.sunuxam.modele.Candidature;
import com.sunuxam.modele.Concours;
import com.sunuxam.modele.StatutCandidature;
import com.sunuxam.modele.Utilisateur;
import com.sunuxam.service.ServiceCandidature;
import com.sunuxam.utilitaire.MappeurCandidature;
import java.time.LocalDate;
import java.util.List;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;


@Service
@Transactional
public class ServiceCandidatureImpl implements ServiceCandidature {

    private final DepotCandidature depotCandidature;
    private final DepotConcours depotConcours;
    private final DepotUtilisateur depotUtilisateur;

    public ServiceCandidatureImpl(DepotCandidature depotCandidature,
                                  DepotConcours depotConcours,
                                  DepotUtilisateur depotUtilisateur) {
        this.depotCandidature = depotCandidature;
        this.depotConcours = depotConcours;
        this.depotUtilisateur = depotUtilisateur;
    }

    @Override
    public ReponseCandidature deposer(Long candidatId, DemandeCandidature demande) {
        Utilisateur candidat = depotUtilisateur.findById(candidatId)
                .orElseThrow(() -> new ExceptionRessourceIntrouvable("Utilisateur", candidatId));
        Concours concours = depotConcours.findById(demande.concoursId())
                .orElseThrow(() -> new ExceptionRessourceIntrouvable("Concours", demande.concoursId()));

        if (!concours.isOuvert()) {
            throw new ExceptionMetier("Ce concours n'accepte pas de candidature actuellement");
        }
        if (concours.getDateLimiteCandidature().isBefore(LocalDate.now())) {
            throw new ExceptionMetier("La date limite de candidature est depassee");
        }
        if (depotCandidature.existsByCandidatIdAndConcoursId(candidatId, concours.getId())) {
            throw new ExceptionMetier("Une candidature a deja ete deposee pour ce concours");
        }

        Candidature candidature = new Candidature(candidat, concours, demande.motivation());
        return MappeurCandidature.versReponse(depotCandidature.save(candidature));
    }

    @Override
    @Transactional(readOnly = true)
    public List<ReponseCandidature> listerMesCandidatures(Long candidatId) {
        return depotCandidature.findByCandidatId(candidatId).stream()
                .map(MappeurCandidature::versReponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<ReponseCandidature> listerParConcours(Long concoursId) {
        return depotCandidature.findByConcoursId(concoursId).stream()
                .map(MappeurCandidature::versReponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<ReponseCandidature> listerParConcoursEtStatut(Long concoursId, StatutCandidature statut) {
        return depotCandidature.findByConcoursIdAndStatut(concoursId, statut).stream()
                .map(MappeurCandidature::versReponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public ReponseCandidature obtenirParId(Long id) {
        return MappeurCandidature.versReponse(recupererEntite(id));
    }

    @Override
    @Transactional(readOnly = true)
    public ReponseCandidature obtenirPourCandidat(Long id, Long candidatId) {
        Candidature candidature = recupererEntite(id);
        verifierProprietaire(candidature, candidatId);
        return MappeurCandidature.versReponse(candidature);
    }

    @Override
    public ReponseCandidature changerStatut(Long id, DemandeChangementStatutCandidature demande) {
        Candidature candidature = recupererEntite(id);
        candidature.setStatut(demande.statut());
        return MappeurCandidature.versReponse(depotCandidature.save(candidature));
    }

    @Override
    public void retirerParCandidat(Long id, Long candidatId) {
        Candidature candidature = recupererEntite(id);
        verifierProprietaire(candidature, candidatId);
        if (candidature.getStatut() != StatutCandidature.EN_ATTENTE) {
            throw new ExceptionMetier("Seule une candidature en attente peut etre retiree");
        }
        supprimerEnBase(candidature);
    }

    @Override
    public void supprimer(Long id) {
        supprimerEnBase(recupererEntite(id));
    }

    private void supprimerEnBase(Candidature candidature) {
        try {
            depotCandidature.delete(candidature);
            depotCandidature.flush();
        } catch (DataIntegrityViolationException ex) {
            throw new ExceptionMetier(
                    "Impossible de supprimer cette candidature : des notes ou un resultat y sont rattaches");
        }
    }

    private Candidature recupererEntite(Long id) {
        return depotCandidature.findById(id)
                .orElseThrow(() -> new ExceptionRessourceIntrouvable("Candidature", id));
    }

    private void verifierProprietaire(Candidature candidature, Long candidatId) {
        if (!candidature.getCandidat().getId().equals(candidatId)) {
            throw new AccessDeniedException("Acces refuse a cette candidature");
        }
    }
}
