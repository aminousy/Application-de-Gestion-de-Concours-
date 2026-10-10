package com.sunuxam.securite;

import com.sunuxam.modele.Role;
import com.sunuxam.modele.Utilisateur;
import java.util.Collection;
import java.util.List;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;


public class UtilisateurDetails implements UserDetails {

    private final Long id;
    private final String email;
    private final String motDePasse;
    private final Role role;
    private final boolean actif;

    public UtilisateurDetails(Utilisateur utilisateur) {
        this.id = utilisateur.getId();
        this.email = utilisateur.getEmail();
        this.motDePasse = utilisateur.getMotDePasse();
        this.role = utilisateur.getRole();
        this.actif = utilisateur.isActif();
    }

    public Long getId() {
        return id;
    }

    public Role getRole() {
        return role;
    }


    public boolean estAdministrateur() {
        return role == Role.ROLE_ADMIN;
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of(new SimpleGrantedAuthority(role.name()));
    }

    @Override
    public String getPassword() {
        return motDePasse;
    }

    @Override
    public String getUsername() {
        return email;
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return actif;
    }
}
