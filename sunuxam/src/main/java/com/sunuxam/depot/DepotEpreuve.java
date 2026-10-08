package com.sunuxam.depot;

import com.sunuxam.modele.Epreuve;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

/**
 * Depot d'acces aux epreuves.
 */
@Repository
public interface DepotEpreuve extends JpaRepository<Epreuve, Long> {

    /** Liste les epreuves rattachees a un concours. */
    List<Epreuve> findByConcoursId(Long concoursId);

    /** Compte les epreuves d'un concours. */
    long countByConcoursId(Long concoursId);
}
