package com.sunuxam.service;

import com.sunuxam.dto.DemandeEpreuve;
import com.sunuxam.dto.DemandeMiseAJourEpreuve;
import com.sunuxam.dto.ReponseEpreuve;
import java.util.List;


public interface ServiceEpreuve {

    ReponseEpreuve creer(DemandeEpreuve demande);

    ReponseEpreuve mettreAJour(Long id, DemandeMiseAJourEpreuve demande);

    void supprimer(Long id);

    List<ReponseEpreuve> listerParConcours(Long concoursId);

    ReponseEpreuve obtenirParId(Long id);
}
