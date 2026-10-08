package com.sunuxam.securite;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;


@Component
public class FiltreAuthentificationJwt extends OncePerRequestFilter {

    private static final Logger JOURNAL = LoggerFactory.getLogger(FiltreAuthentificationJwt.class);
    private static final String EN_TETE_AUTORISATION = "Authorization";
    private static final String PREFIXE_BEARER = "Bearer ";

    private final FournisseurJetonJwt fournisseurJeton;
    private final ServiceDetailsUtilisateur serviceDetailsUtilisateur;

    public FiltreAuthentificationJwt(FournisseurJetonJwt fournisseurJeton,
                                     ServiceDetailsUtilisateur serviceDetailsUtilisateur) {
        this.fournisseurJeton = fournisseurJeton;
        this.serviceDetailsUtilisateur = serviceDetailsUtilisateur;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest requete,
                                    HttpServletResponse reponse,
                                    FilterChain chaine) throws ServletException, IOException {
        String jeton = extraireJeton(requete);
        if (jeton != null
                && fournisseurJeton.estValide(jeton)
                && SecurityContextHolder.getContext().getAuthentication() == null) {
            authentifier(jeton, requete);
        }
        chaine.doFilter(requete, reponse);
    }

    private void authentifier(String jeton, HttpServletRequest requete) {
        String email = fournisseurJeton.extraireEmail(jeton);
        try {
            UserDetails details = serviceDetailsUtilisateur.loadUserByUsername(email);
            if (details.isEnabled()) {
                UsernamePasswordAuthenticationToken authentification =
                        new UsernamePasswordAuthenticationToken(details, null, details.getAuthorities());
                authentification.setDetails(new WebAuthenticationDetailsSource().buildDetails(requete));
                SecurityContextHolder.getContext().setAuthentication(authentification);
            }
        } catch (UsernameNotFoundException ex) {
            JOURNAL.debug("Utilisateur du jeton introuvable : {}", email);
        }
    }

    private String extraireJeton(HttpServletRequest requete) {
        String entete = requete.getHeader(EN_TETE_AUTORISATION);
        if (entete != null && entete.startsWith(PREFIXE_BEARER)) {
            return entete.substring(PREFIXE_BEARER.length());
        }
        return null;
    }
}
