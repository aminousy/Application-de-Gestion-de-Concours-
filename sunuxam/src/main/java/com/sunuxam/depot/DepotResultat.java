package com.sunuxam.depot;

import com.sunuxam.modele.Resultat;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;


@Repository
public interface DepotResultat extends JpaRepository<Resultat, Long> {


    Optional<Resultat> findByCandidatureId(Long candidatureId);


    boolean existsByCandidatureId(Long candidatureId);


    List<Resultat> findByCandidature_ConcoursId(Long concoursId);


    List<Resultat> findByCandidature_ConcoursIdOrderByMoyenneDesc(Long concoursId);
}
