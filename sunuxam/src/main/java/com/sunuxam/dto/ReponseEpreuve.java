package com.sunuxam.dto;


public record ReponseEpreuve(

        Long id,

        String intitule,

        String description,

        double coefficient,

        int dureeMinutes,

        Long concoursId) {
}
