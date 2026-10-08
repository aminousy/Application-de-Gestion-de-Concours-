package com.sunuxam.depot;

import com.sunuxam.modele.Concours;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

/**
 * Depot d'acces aux concours.
 */
@Repository
public interface DepotConcours extends JpaRepository<Concours, Long> {

    /** Liste les concours actuellement ouverts aux candidatures */
    List<Concours> findByOuvertTrue();
}
