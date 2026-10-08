package com.sunuxam.modele;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDateTime;


@Entity
@Table(
        name = "note",
        uniqueConstraints = @UniqueConstraint(
                name = "uc_note_candidature_epreuve",
                columnNames = {"candidature_id", "epreuve_id"}))
public class Note extends ModeleBase {

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "candidature_id", nullable = false)
    private Candidature candidature;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "epreuve_id", nullable = false)
    private Epreuve epreuve;

    @DecimalMin("0.0")
    @DecimalMax("20.0")
    @Column(nullable = false)
    private double valeur;

    @Column(name = "date_saisie", nullable = false)
    private LocalDateTime dateSaisie;

    public Note() {
    }

    public Note(Candidature candidature, Epreuve epreuve, double valeur) {
        this.candidature = candidature;
        this.epreuve = epreuve;
        this.valeur = valeur;
    }

    @PrePersist
    private void avantPersistance() {
        if (dateSaisie == null) {
            dateSaisie = LocalDateTime.now();
        }
    }

    public Candidature getCandidature() {
        return candidature;
    }

    public void setCandidature(Candidature candidature) {
        this.candidature = candidature;
    }

    public Epreuve getEpreuve() {
        return epreuve;
    }

    public void setEpreuve(Epreuve epreuve) {
        this.epreuve = epreuve;
    }

    public double getValeur() {
        return valeur;
    }

    public void setValeur(double valeur) {
        this.valeur = valeur;
    }

    public LocalDateTime getDateSaisie() {
        return dateSaisie;
    }

    public void setDateSaisie(LocalDateTime dateSaisie) {
        this.dateSaisie = dateSaisie;
    }
}
