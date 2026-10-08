package com.sunuxam.depot;

import com.sunuxam.modele.Resultat;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

/**
 * Depot d'acces aux resultats.
 */
@Repository
public interface DepotResultat extends JpaRepository<Resultat, Long> {

    /** Recupere le resultat associe a une candidature. */
    Optional<Resultat> findByCandidatureId(Long candidatureId);

    /** Indique si un resultat a deja ete calcule pour cette candidature. */
    boolean existsByCandidatureId(Long candidatureId);

    /** Liste les resultats d'un concours  */
    List<Resultat> findByCandidature_ConcoursId(Long concoursId);

    /** Liste les resultats d'un concours tries  */
    List<Resultat> findByCandidature_ConcoursIdOrderByMoyenneDesc(Long concoursId);
}
