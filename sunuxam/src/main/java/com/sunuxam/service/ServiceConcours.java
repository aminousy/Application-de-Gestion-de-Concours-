package com.sunuxam.service;

import com.sunuxam.dto.DemandeConcours;
import com.sunuxam.dto.ReponseConcours;
import com.sunuxam.dto.ReponseConcoursDetail;
import java.util.List;

/**
 * Operations de gestion des concours.
 */
public interface ServiceConcours {

    ReponseConcours creer(DemandeConcours demande);

    ReponseConcours mettreAJour(Long id, DemandeConcours demande);

    void supprimer(Long id);

    List<ReponseConcours> listerTous();

    List<ReponseConcours> listerOuverts();

    ReponseConcoursDetail obtenirDetail(Long id);


    ReponseConcours definirOuverture(Long id, boolean ouvert);
}
