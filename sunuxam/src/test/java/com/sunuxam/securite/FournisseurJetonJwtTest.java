package com.sunuxam.securite;

import static org.assertj.core.api.Assertions.assertThat;

import com.sunuxam.modele.Role;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

class FournisseurJetonJwtTest {

    private FournisseurJetonJwt fournisseur;

    @BeforeEach
    void initialiser() {
        ProprietesJwt proprietes = new ProprietesJwt(
                "cle-secrete-de-test-uniquement-32-octets-minimum-ok", 3_600_000L, "sunuxam-test");
        fournisseur = new FournisseurJetonJwt(proprietes);
    }

    @Test
    void genere_un_jeton_valide_et_en_extrait_les_informations() {
        String jeton = fournisseur.genererJeton("awa@test.sn", Role.ROLE_CANDIDAT);

        assertThat(fournisseur.estValide(jeton)).isTrue();
        assertThat(fournisseur.extraireEmail(jeton)).isEqualTo("awa@test.sn");
        assertThat(fournisseur.extraireRole(jeton)).isEqualTo("ROLE_CANDIDAT");
    }

    @Test
    void rejette_un_jeton_falsifie() {
        String jeton = fournisseur.genererJeton("awa@test.sn", Role.ROLE_ADMIN);

        assertThat(fournisseur.estValide(jeton + "x")).isFalse();
    }
}
