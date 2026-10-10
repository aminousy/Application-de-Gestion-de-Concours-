package com.sunuxam.depot;

import com.sunuxam.modele.Epreuve;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;


@Repository
public interface DepotEpreuve extends JpaRepository<Epreuve, Long> {


    List<Epreuve> findByConcoursId(Long concoursId);


    long countByConcoursId(Long concoursId);
}
