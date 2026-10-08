package com.sunuxam.modele;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDateTime;


@Entity
@Table(name = "resultat")
public class Resultat extends ModeleBase {

    @NotNull
    @OneToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "candidature_id", nullable = false, unique = true)
    private Candidature candidature;


    @Column(nullable = false)
    private double moyenne;

    /** Rang du candidat  */
    @Column
    private Integer rang;

    @Column(nullable = false)
    private boolean admis = false;


    @Column(length = 500)
    private String decision;


    @Column(name = "date_calcul", nullable = false)
    private LocalDateTime dateCalcul;

    public Resultat() {
    }

    public Resultat(Candidature candidature, double moyenne) {
        this.candidature = candidature;
        this.moyenne = moyenne;
    }

    @PrePersist
    @PreUpdate
    private void horodaterCalcul() {
        dateCalcul = LocalDateTime.now();
    }

    public Candidature getCandidature() {
        return candidature;
    }

    public void setCandidature(Candidature candidature) {
        this.candidature = candidature;
    }

    public double getMoyenne() {
        return moyenne;
    }

    public void setMoyenne(double moyenne) {
        this.moyenne = moyenne;
    }

    public Integer getRang() {
        return rang;
    }

    public void setRang(Integer rang) {
        this.rang = rang;
    }

    public boolean isAdmis() {
        return admis;
    }

    public void setAdmis(boolean admis) {
        this.admis = admis;
    }

    public String getDecision() {
        return decision;
    }

    public void setDecision(String decision) {
        this.decision = decision;
    }

    public LocalDateTime getDateCalcul() {
        return dateCalcul;
    }

    public void setDateCalcul(LocalDateTime dateCalcul) {
        this.dateCalcul = dateCalcul;
    }
}
