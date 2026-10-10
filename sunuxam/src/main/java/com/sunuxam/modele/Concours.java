package com.sunuxam.modele;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;


@Entity
@Table(name = "concours")
public class Concours extends ModeleBase {

    @NotBlank
    @Column(nullable = false)
    private String titre;

    @Column(length = 2000)
    private String description;

    @NotNull
    @Column(name = "date_limite_candidature", nullable = false)
    private LocalDate dateLimiteCandidature;

    @Column(name = "date_deliberation")
    private LocalDate dateDeliberation;

    @Positive
    @Column(name = "nombre_places", nullable = false)
    private int nombrePlaces;


    @Column(nullable = false)
    private boolean ouvert = false;


    @Column(name = "resultats_publies", nullable = false)
    private boolean resultatsPublies = false;

    @Column(name = "date_publication_resultats")
    private LocalDateTime datePublicationResultats;

    @OneToMany(mappedBy = "concours", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Epreuve> epreuves = new ArrayList<>();

    public Concours() {
    }

    public Concours(String titre, String description, LocalDate dateLimiteCandidature,
                    LocalDate dateDeliberation, int nombrePlaces) {
        this.titre = titre;
        this.description = description;
        this.dateLimiteCandidature = dateLimiteCandidature;
        this.dateDeliberation = dateDeliberation;
        this.nombrePlaces = nombrePlaces;
    }


    public void ajouterEpreuve(Epreuve epreuve) {
        epreuves.add(epreuve);
        epreuve.setConcours(this);
    }


    public void retirerEpreuve(Epreuve epreuve) {
        epreuves.remove(epreuve);
        epreuve.setConcours(null);
    }

    public String getTitre() {
        return titre;
    }

    public void setTitre(String titre) {
        this.titre = titre;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public LocalDate getDateLimiteCandidature() {
        return dateLimiteCandidature;
    }

    public void setDateLimiteCandidature(LocalDate dateLimiteCandidature) {
        this.dateLimiteCandidature = dateLimiteCandidature;
    }

    public LocalDate getDateDeliberation() {
        return dateDeliberation;
    }

    public void setDateDeliberation(LocalDate dateDeliberation) {
        this.dateDeliberation = dateDeliberation;
    }

    public int getNombrePlaces() {
        return nombrePlaces;
    }

    public void setNombrePlaces(int nombrePlaces) {
        this.nombrePlaces = nombrePlaces;
    }

    public boolean isOuvert() {
        return ouvert;
    }

    public void setOuvert(boolean ouvert) {
        this.ouvert = ouvert;
    }

    public boolean isResultatsPublies() {
        return resultatsPublies;
    }

    public void setResultatsPublies(boolean resultatsPublies) {
        this.resultatsPublies = resultatsPublies;
    }

    public LocalDateTime getDatePublicationResultats() {
        return datePublicationResultats;
    }

    public void setDatePublicationResultats(LocalDateTime datePublicationResultats) {
        this.datePublicationResultats = datePublicationResultats;
    }

    public List<Epreuve> getEpreuves() {
        return epreuves;
    }

    public void setEpreuves(List<Epreuve> epreuves) {
        this.epreuves = epreuves;
    }
}
