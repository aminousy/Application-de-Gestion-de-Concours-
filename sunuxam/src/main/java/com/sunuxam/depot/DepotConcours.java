package com.sunuxam.depot;

import com.sunuxam.modele.Concours;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;


@Repository
public interface DepotConcours extends JpaRepository<Concours, Long> {


    List<Concours> findByOuvertTrue();
}
