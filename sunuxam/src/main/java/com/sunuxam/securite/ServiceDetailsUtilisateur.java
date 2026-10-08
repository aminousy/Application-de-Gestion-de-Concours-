package com.sunuxam.securite;

import com.sunuxam.depot.DepotUtilisateur;
import com.sunuxam.modele.Utilisateur;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class ServiceDetailsUtilisateur implements UserDetailsService {

    private final DepotUtilisateur depotUtilisateur;

    public ServiceDetailsUtilisateur(DepotUtilisateur depotUtilisateur) {
        this.depotUtilisateur = depotUtilisateur;
    }

    @Override
    @Transactional(readOnly = true)
    public UserDetails loadUserByUsername(String email) {
        String emailNormalise = email == null ? null : email.trim().toLowerCase();
        Utilisateur utilisateur = depotUtilisateur.findByEmail(emailNormalise)
                .orElseThrow(() -> new UsernameNotFoundException("Utilisateur introuvable : " + email));
        return new UtilisateurDetails(utilisateur);
    }
}
