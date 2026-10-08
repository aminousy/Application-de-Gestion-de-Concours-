package com.sunuxam.depot;

import com.sunuxam.modele.Candidature;
import com.sunuxam.modele.StatutCandidature;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

/**
 * Depot d'acces aux candidatures.
 */
@Repository
public interface DepotCandidature extends JpaRepository<Candidature, Long> {

    /** Liste les candidatures deposees par un candidat. */
    List<Candidature> findByCandidatId(Long candidatId);

    /** Liste les candidatures recues pour un concours. */
    List<Candidature> findByConcoursId(Long concoursId);

    /** Recupere la candidature d'un candidat pour un concours precis. */
    Optional<Candidature> findByCandidatIdAndConcoursId(Long candidatId, Long concoursId);

    /** Indique si le candidat a deja postule a ce concours. */
    boolean existsByCandidatIdAndConcoursId(Long candidatId, Long concoursId);

    /** Liste les candidatures d'un concours filtrees par statut. */
    List<Candidature> findByConcoursIdAndStatut(Long concoursId, StatutCandidature statut);
}
