package com.sunuxam.service.implementation;

import com.sunuxam.depot.DepotUtilisateur;
import com.sunuxam.dto.DemandeAdministrationUtilisateur;
import com.sunuxam.dto.DemandeChangementMotDePasse;
import com.sunuxam.dto.DemandeCreationUtilisateur;
import com.sunuxam.dto.DemandeInscription;
import com.sunuxam.dto.DemandeMiseAJourUtilisateur;
import com.sunuxam.dto.ReponseUtilisateur;
import com.sunuxam.exception.ExceptionDonneeInvalide;
import com.sunuxam.exception.ExceptionMetier;
import com.sunuxam.exception.ExceptionRessourceIntrouvable;
import com.sunuxam.modele.Role;
import com.sunuxam.modele.Utilisateur;
import com.sunuxam.service.ServiceUtilisateur;
import com.sunuxam.utilitaire.MappeurUtilisateur;
import java.util.List;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Implementation des operations de gestion des utilisateurs.
 */
@Service
@Transactional
public class ServiceUtilisateurImpl implements ServiceUtilisateur {

    private final DepotUtilisateur depotUtilisateur;
    private final PasswordEncoder encodeurMotDePasse;

    public ServiceUtilisateurImpl(DepotUtilisateur depotUtilisateur, PasswordEncoder encodeurMotDePasse) {
        this.depotUtilisateur = depotUtilisateur;
        this.encodeurMotDePasse = encodeurMotDePasse;
    }

    @Override
    public ReponseUtilisateur inscrireCandidat(DemandeInscription demande) {
        String email = normaliserEmail(demande.email());
        verifierEmailDisponible(email);
        Utilisateur utilisateur = new Utilisateur(
                demande.nom().trim(),
                demande.prenom().trim(),
                email,
                encodeurMotDePasse.encode(demande.motDePasse()),
                Role.ROLE_CANDIDAT);
        utilisateur.setTelephone(demande.telephone());
        return MappeurUtilisateur.versReponse(depotUtilisateur.save(utilisateur));
    }

    @Override
    public ReponseUtilisateur creer(DemandeCreationUtilisateur demande) {
        String email = normaliserEmail(demande.email());
        verifierEmailDisponible(email);
        Utilisateur utilisateur = new Utilisateur(
                demande.nom().trim(),
                demande.prenom().trim(),
                email,
                encodeurMotDePasse.encode(demande.motDePasse()),
                demande.role());
        utilisateur.setTelephone(demande.telephone());
        return MappeurUtilisateur.versReponse(depotUtilisateur.save(utilisateur));
    }

    @Override
    @Transactional(readOnly = true)
    public List<ReponseUtilisateur> listerTous() {
        return depotUtilisateur.findAll().stream()
                .map(MappeurUtilisateur::versReponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<ReponseUtilisateur> listerParRole(Role role) {
        return depotUtilisateur.findByRole(role).stream()
                .map(MappeurUtilisateur::versReponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public ReponseUtilisateur obtenirParId(Long id) {
        return MappeurUtilisateur.versReponse(recupererEntite(id));
    }

    @Override
    public ReponseUtilisateur mettreAJourProfil(Long id, DemandeMiseAJourUtilisateur demande) {
        Utilisateur utilisateur = recupererEntite(id);
        utilisateur.setNom(demande.nom().trim());
        utilisateur.setPrenom(demande.prenom().trim());
        utilisateur.setTelephone(demande.telephone());
        return MappeurUtilisateur.versReponse(depotUtilisateur.save(utilisateur));
    }

    @Override
    public void changerMotDePasse(Long id, DemandeChangementMotDePasse demande) {
        Utilisateur utilisateur = recupererEntite(id);
        if (!encodeurMotDePasse.matches(demande.ancienMotDePasse(), utilisateur.getMotDePasse())) {
            throw new ExceptionDonneeInvalide("L'ancien mot de passe est incorrect");
        }
        utilisateur.setMotDePasse(encodeurMotDePasse.encode(demande.nouveauMotDePasse()));
        depotUtilisateur.save(utilisateur);
    }

    @Override
    public ReponseUtilisateur administrer(Long id, DemandeAdministrationUtilisateur demande) {
        Utilisateur utilisateur = recupererEntite(id);
        if (demande.role() != null) {
            utilisateur.setRole(demande.role());
        }
        if (demande.actif() != null) {
            utilisateur.setActif(demande.actif());
        }
        return MappeurUtilisateur.versReponse(depotUtilisateur.save(utilisateur));
    }

    @Override
    public void supprimer(Long id) {
        Utilisateur utilisateur = recupererEntite(id);
        try {
            depotUtilisateur.delete(utilisateur);
            depotUtilisateur.flush();
        } catch (DataIntegrityViolationException ex) {
            throw new ExceptionMetier(
                    "Impossible de supprimer cet utilisateur : des donnees liees existent");
        }
    }

    private Utilisateur recupererEntite(Long id) {
        return depotUtilisateur.findById(id)
                .orElseThrow(() -> new ExceptionRessourceIntrouvable("Utilisateur", id));
    }

    private void verifierEmailDisponible(String email) {
        if (depotUtilisateur.existsByEmail(email)) {
            throw new ExceptionMetier("Un compte existe deja avec cette adresse email");
        }
    }

    private static String normaliserEmail(String email) {
        return email == null ? null : email.trim().toLowerCase();
    }
}
