package com.sunuxam.depot;

import com.sunuxam.modele.Role;
import com.sunuxam.modele.Utilisateur;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

/**
 * Depot d'acces aux utilisateurs.
 */
@Repository
public interface DepotUtilisateur extends JpaRepository<Utilisateur, Long> {

    /** Recherche un utilisateur par son adresse email  */
    Optional<Utilisateur> findByEmail(String email);

    /** Indique si un utilisateur possede deja cette adresse email*/
    boolean existsByEmail(String email);

    /** Liste les utilisateurs ayant un role donne*/
    List<Utilisateur> findByRole(Role role);
}
