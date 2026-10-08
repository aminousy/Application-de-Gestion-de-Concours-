package com.sunuxam.modele;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDateTime;


@Entity
@Table(
        name = "candidature",
        uniqueConstraints = @UniqueConstraint(
                name = "uc_candidature_candidat_concours",
                columnNames = {"candidat_id", "concours_id"}))
public class Candidature extends ModeleBase {

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "candidat_id", nullable = false)
    private Utilisateur candidat;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "concours_id", nullable = false)
    private Concours concours;

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 40)
    private StatutCandidature statut = StatutCandidature.EN_ATTENTE;

    @Column(name = "date_depot", nullable = false)
    private LocalDateTime dateDepot;

    @Column(length = 2000)
    private String motivation;

    public Candidature() {
    }

    public Candidature(Utilisateur candidat, Concours concours, String motivation) {
        this.candidat = candidat;
        this.concours = concours;
        this.motivation = motivation;
    }

    @PrePersist
    private void avantPersistance() {
        if (dateDepot == null) {
            dateDepot = LocalDateTime.now();
        }
        if (statut == null) {
            statut = StatutCandidature.EN_ATTENTE;
        }
    }

    public Utilisateur getCandidat() {
        return candidat;
    }

    public void setCandidat(Utilisateur candidat) {
        this.candidat = candidat;
    }

    public Concours getConcours() {
        return concours;
    }

    public void setConcours(Concours concours) {
        this.concours = concours;
    }

    public StatutCandidature getStatut() {
        return statut;
    }

    public void setStatut(StatutCandidature statut) {
        this.statut = statut;
    }

    public LocalDateTime getDateDepot() {
        return dateDepot;
    }

    public void setDateDepot(LocalDateTime dateDepot) {
        this.dateDepot = dateDepot;
    }

    public String getMotivation() {
        return motivation;
    }

    public void setMotivation(String motivation) {
        this.motivation = motivation;
    }
}
