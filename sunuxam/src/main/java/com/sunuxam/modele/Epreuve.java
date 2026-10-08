package com.sunuxam.modele;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;


@Entity
@Table(name = "epreuve")
public class Epreuve extends ModeleBase {

    @NotBlank
    @Column(nullable = false)
    private String intitule;

    @Column(length = 1000)
    private String description;

    @Positive
    @Column(nullable = false)
    private double coefficient;

    @Positive
    @Column(name = "duree_minutes", nullable = false)
    private int dureeMinutes;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "concours_id", nullable = false)
    private Concours concours;

    public Epreuve() {
    }

    public Epreuve(String intitule, String description, double coefficient, int dureeMinutes) {
        this.intitule = intitule;
        this.description = description;
        this.coefficient = coefficient;
        this.dureeMinutes = dureeMinutes;
    }

    public String getIntitule() {
        return intitule;
    }

    public void setIntitule(String intitule) {
        this.intitule = intitule;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public double getCoefficient() {
        return coefficient;
    }

    public void setCoefficient(double coefficient) {
        this.coefficient = coefficient;
    }

    public int getDureeMinutes() {
        return dureeMinutes;
    }

    public void setDureeMinutes(int dureeMinutes) {
        this.dureeMinutes = dureeMinutes;
    }

    public Concours getConcours() {
        return concours;
    }

    public void setConcours(Concours concours) {
        this.concours = concours;
    }
}
