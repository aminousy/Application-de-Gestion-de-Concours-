package com.sunuxam.configuration;

import com.sunuxam.depot.DepotUtilisateur;
import com.sunuxam.modele.Role;
import com.sunuxam.modele.Utilisateur;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;


@Component
public class InitialisateurAdmin implements ApplicationRunner {

    private static final Logger JOURNAL = LoggerFactory.getLogger(InitialisateurAdmin.class);

    private final DepotUtilisateur depotUtilisateur;
    private final PasswordEncoder encodeurMotDePasse;
    private final ProprietesAdminInitial proprietes;

    public InitialisateurAdmin(DepotUtilisateur depotUtilisateur,
                               PasswordEncoder encodeurMotDePasse,
                               ProprietesAdminInitial proprietes) {
        this.depotUtilisateur = depotUtilisateur;
        this.encodeurMotDePasse = encodeurMotDePasse;
        this.proprietes = proprietes;
    }

    @Override
    @Transactional
    public void run(ApplicationArguments args) {
        if (!proprietes.creationAutomatique()) {
            return;
        }
        if (!depotUtilisateur.findByRole(Role.ROLE_ADMIN).isEmpty()) {
            return;
        }
        Utilisateur admin = new Utilisateur(
                proprietes.nom(),
                proprietes.prenom(),
                proprietes.email().trim().toLowerCase(),
                encodeurMotDePasse.encode(proprietes.motDePasse()),
                Role.ROLE_ADMIN);
        depotUtilisateur.save(admin);
        JOURNAL.info("Compte administrateur initial cree : {}", admin.getEmail());
    }
}
