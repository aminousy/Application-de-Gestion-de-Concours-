package com.sunuxam.modele;

import jakarta.persistence.Column;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.MappedSuperclass;
import java.time.Instant;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;


@MappedSuperclass
public abstract class ModeleBase {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @CreationTimestamp
    @Column(name = "date_creation", nullable = false, updatable = false)
    private Instant dateCreation;

    @UpdateTimestamp
    @Column(name = "date_modification")
    private Instant dateModification;

    protected ModeleBase() {
    }

    public Long getId() {
        return id;
    }

    public Instant getDateCreation() {
        return dateCreation;
    }

    public Instant getDateModification() {
        return dateModification;
    }

    @Override
    public boolean equals(Object obj) {
        if (this == obj) {
            return true;
        }
        if (!(obj instanceof ModeleBase autre)) {
            return false;
        }
        return id != null && id.equals(autre.id);
    }

    @Override
    public int hashCode() {
        return getClass().hashCode();
    }
}
