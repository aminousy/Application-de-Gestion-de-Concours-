package com.sunuxam.dto;

import com.sunuxam.modele.Role;

public record ReponseAuthentification(

        String token,

        String typeToken,

        String email,

        Role role,

        long dureeValiditeMs) {

    public static ReponseAuthentification bearer(String token, String email, Role role, long dureeValiditeMs) {
        return new ReponseAuthentification(token, "Bearer", email, role, dureeValiditeMs);
    }
}
