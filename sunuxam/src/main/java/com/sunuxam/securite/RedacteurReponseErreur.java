package com.sunuxam.securite;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.sunuxam.exception.ReponseErreur;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import org.springframework.http.MediaType;


final class RedacteurReponseErreur {

    private RedacteurReponseErreur() {
    }

    static void ecrire(HttpServletResponse reponse, int statut, String message,
                       String chemin, ObjectMapper objectMapper) throws IOException {
        reponse.setStatus(statut);
        reponse.setContentType(MediaType.APPLICATION_JSON_VALUE);
        reponse.setCharacterEncoding(StandardCharsets.UTF_8.name());
        ReponseErreur corps = ReponseErreur.simple(statut, message, chemin);
        objectMapper.writeValue(reponse.getOutputStream(), corps);
    }
}
