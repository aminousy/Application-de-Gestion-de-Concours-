package com.sunuxam.depot;

import com.sunuxam.modele.Note;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

/**
 * Depot d'acces aux notes.
 */
@Repository
public interface DepotNote extends JpaRepository<Note, Long> {

    /** Liste les notes saisies pour une candidature. */
    List<Note> findByCandidatureId(Long candidatureId);

    /** Recupere la note d'une candidature  */
    Optional<Note> findByCandidatureIdAndEpreuveId(Long candidatureId, Long epreuveId);

    /** Indique si une note existe deja */
    boolean existsByCandidatureIdAndEpreuveId(Long candidatureId, Long epreuveId);

    /** Compte les notes saisies pour une candidature */
    long countByCandidatureId(Long candidatureId);

    /** Liste les notes rattachees a une epreuve */
    List<Note> findByEpreuveId(Long epreuveId);
}
