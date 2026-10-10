package com.sunuxam.depot;

import com.sunuxam.modele.Candidature;
import com.sunuxam.modele.StatutCandidature;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;


@Repository
public interface DepotCandidature extends JpaRepository<Candidature, Long> {


    List<Candidature> findByCandidatId(Long candidatId);


    List<Candidature> findByConcoursId(Long concoursId);


    Optional<Candidature> findByCandidatIdAndConcoursId(Long candidatId, Long concoursId);


    boolean existsByCandidatIdAndConcoursId(Long candidatId, Long concoursId);


    List<Candidature> findByConcoursIdAndStatut(Long concoursId, StatutCandidature statut);
}
