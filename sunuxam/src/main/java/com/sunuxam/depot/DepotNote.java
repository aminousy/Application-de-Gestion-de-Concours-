package com.sunuxam.depot;

import com.sunuxam.modele.Note;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;


@Repository
public interface DepotNote extends JpaRepository<Note, Long> {


    List<Note> findByCandidatureId(Long candidatureId);


    Optional<Note> findByCandidatureIdAndEpreuveId(Long candidatureId, Long epreuveId);


    boolean existsByCandidatureIdAndEpreuveId(Long candidatureId, Long epreuveId);


    long countByCandidatureId(Long candidatureId);


    List<Note> findByEpreuveId(Long epreuveId);
}
