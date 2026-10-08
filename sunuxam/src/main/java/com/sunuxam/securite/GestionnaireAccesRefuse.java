package com.sunuxam.securite;

import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.web.access.AccessDeniedHandler;
import org.springframework.stereotype.Component;


@Component
public class GestionnaireAccesRefuse implements AccessDeniedHandler {

    private final ObjectMapper objectMapper;

    public GestionnaireAccesRefuse(ObjectMapper objectMapper) {
        this.objectMapper = objectMapper;
    }

    @Override
    public void handle(HttpServletRequest requete, HttpServletResponse reponse,
                       AccessDeniedException exception) throws IOException {
        RedacteurReponseErreur.ecrire(reponse, HttpStatus.FORBIDDEN.value(),
                "Acces refuse", requete.getRequestURI(), objectMapper);
    }
}
