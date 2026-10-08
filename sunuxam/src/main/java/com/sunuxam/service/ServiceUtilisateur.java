package com.sunuxam.service;

import com.sunuxam.dto.DemandeAdministrationUtilisateur;
import com.sunuxam.dto.DemandeChangementMotDePasse;
import com.sunuxam.dto.DemandeCreationUtilisateur;
import com.sunuxam.dto.DemandeInscription;
import com.sunuxam.dto.DemandeMiseAJourUtilisateur;
import com.sunuxam.dto.ReponseUtilisateur;
import com.sunuxam.modele.Role;
import java.util.List;

/**
 * Operations de gestion des utilisateurs.
 */
public interface ServiceUtilisateur {

    /** Inscrit un nouveau candidat  */
    ReponseUtilisateur inscrireCandidat(DemandeInscription demande);


    ReponseUtilisateur creer(DemandeCreationUtilisateur demande);

    List<ReponseUtilisateur> listerTous();

    List<ReponseUtilisateur> listerParRole(Role role);

    ReponseUtilisateur obtenirParId(Long id);

    ReponseUtilisateur mettreAJourProfil(Long id, DemandeMiseAJourUtilisateur demande);

    void changerMotDePasse(Long id, DemandeChangementMotDePasse demande);

    /** Modifie le role */
    ReponseUtilisateur administrer(Long id, DemandeAdministrationUtilisateur demande);

    void supprimer(Long id);
}
