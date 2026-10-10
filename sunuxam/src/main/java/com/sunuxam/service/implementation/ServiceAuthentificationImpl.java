package com.sunuxam.service.implementation;

import com.sunuxam.depot.DepotUtilisateur;
import com.sunuxam.dto.DemandeConnexion;
import com.sunuxam.dto.DemandeInscription;
import com.sunuxam.dto.ReponseAuthentification;
import com.sunuxam.dto.ReponseUtilisateur;
import com.sunuxam.modele.Utilisateur;
import com.sunuxam.securite.FournisseurJetonJwt;
import com.sunuxam.service.ServiceAuthentification;
import com.sunuxam.service.ServiceUtilisateur;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.DisabledException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;


@Service
public class ServiceAuthentificationImpl implements ServiceAuthentification {

    private final ServiceUtilisateur serviceUtilisateur;
    private final DepotUtilisateur depotUtilisateur;
    private final PasswordEncoder encodeurMotDePasse;
    private final FournisseurJetonJwt fournisseurJeton;

    public ServiceAuthentificationImpl(ServiceUtilisateur serviceUtilisateur,
                                       DepotUtilisateur depotUtilisateur,
                                       PasswordEncoder encodeurMotDePasse,
                                       FournisseurJetonJwt fournisseurJeton) {
        this.serviceUtilisateur = serviceUtilisateur;
        this.depotUtilisateur = depotUtilisateur;
        this.encodeurMotDePasse = encodeurMotDePasse;
        this.fournisseurJeton = fournisseurJeton;
    }

    @Override
    public ReponseAuthentification inscrire(DemandeInscription demande) {
        ReponseUtilisateur utilisateur = serviceUtilisateur.inscrireCandidat(demande);
        String jeton = fournisseurJeton.genererJeton(utilisateur.email(), utilisateur.role());
        return ReponseAuthentification.bearer(
                jeton, utilisateur.email(), utilisateur.role(), fournisseurJeton.dureeValiditeMs());
    }

    @Override
    @Transactional(readOnly = true)
    public ReponseAuthentification connecter(DemandeConnexion demande) {
        String email = demande.email().trim().toLowerCase();
        Utilisateur utilisateur = depotUtilisateur.findByEmail(email)
                .orElseThrow(() -> new BadCredentialsException("Identifiants invalides"));
        if (!utilisateur.isActif()) {
            throw new DisabledException("Ce compte est desactive");
        }
        if (!encodeurMotDePasse.matches(demande.motDePasse(), utilisateur.getMotDePasse())) {
            throw new BadCredentialsException("Identifiants invalides");
        }
        String jeton = fournisseurJeton.genererJeton(utilisateur.getEmail(), utilisateur.getRole());
        return ReponseAuthentification.bearer(
                jeton, utilisateur.getEmail(), utilisateur.getRole(), fournisseurJeton.dureeValiditeMs());
    }
}
