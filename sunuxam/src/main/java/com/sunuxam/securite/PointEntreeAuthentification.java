package com.sunuxam.securite;

import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.stereotype.Component;


@Component
public class PointEntreeAuthentification implements AuthenticationEntryPoint {

    private final ObjectMapper objectMapper;

    public PointEntreeAuthentification(ObjectMapper objectMapper) {
        this.objectMapper = objectMapper;
    }

    @Override
    public void commence(HttpServletRequest requete, HttpServletResponse reponse,
                         AuthenticationException exception) throws IOException {
        RedacteurReponseErreur.ecrire(reponse, HttpStatus.UNAUTHORIZED.value(),
                "Authentification requise ou invalide", requete.getRequestURI(), objectMapper);
    }
}
