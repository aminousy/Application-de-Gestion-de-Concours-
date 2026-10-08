package com.sunuxam.dto;

/**
 * Representation d'une epreuve.
 */
public record ReponseEpreuve(

        Long id,

        String intitule,

        String description,

        double coefficient,

        int dureeMinutes,

        Long concoursId) {
}
