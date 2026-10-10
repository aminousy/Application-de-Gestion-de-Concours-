package com.sunuxam.depot;

import com.sunuxam.modele.Role;
import com.sunuxam.modele.Utilisateur;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;


@Repository
public interface DepotUtilisateur extends JpaRepository<Utilisateur, Long> {


    Optional<Utilisateur> findByEmail(String email);


    boolean existsByEmail(String email);


    List<Utilisateur> findByRole(Role role);
}
