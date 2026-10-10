package com.sunuxam.securite;

import com.sunuxam.modele.Role;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import java.nio.charset.StandardCharsets;
import java.time.Instant;
import java.util.Date;
import javax.crypto.SecretKey;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;


@Component
public class FournisseurJetonJwt {

    private static final Logger JOURNAL = LoggerFactory.getLogger(FournisseurJetonJwt.class);
    private static final String CLE_ROLE = "role";

    private final ProprietesJwt proprietes;
    private final SecretKey cleSignature;

    public FournisseurJetonJwt(ProprietesJwt proprietes) {
        this.proprietes = proprietes;
        this.cleSignature = Keys.hmacShaKeyFor(proprietes.cleSecrete().getBytes(StandardCharsets.UTF_8));
    }


    public String genererJeton(String email, Role role) {
        Instant maintenant = Instant.now();
        Instant expiration = maintenant.plusMillis(proprietes.dureeValiditeMs());
        return Jwts.builder()
                .subject(email)
                .claim(CLE_ROLE, role.name())
                .issuer(proprietes.emetteur())
                .issuedAt(Date.from(maintenant))
                .expiration(Date.from(expiration))
                .signWith(cleSignature)
                .compact();
    }


    public boolean estValide(String jeton) {
        try {
            analyser(jeton);
            return true;
        } catch (JwtException | IllegalArgumentException ex) {
            JOURNAL.debug("Jeton JWT invalide : {}", ex.getMessage());
            return false;
        }
    }

    public String extraireEmail(String jeton) {
        return analyser(jeton).getSubject();
    }

    public String extraireRole(String jeton) {
        return analyser(jeton).get(CLE_ROLE, String.class);
    }

    public long dureeValiditeMs() {
        return proprietes.dureeValiditeMs();
    }

    private Claims analyser(String jeton) {
        return Jwts.parser()
                .verifyWith(cleSignature)
                .requireIssuer(proprietes.emetteur())
                .build()
                .parseSignedClaims(jeton)
                .getPayload();
    }
}
