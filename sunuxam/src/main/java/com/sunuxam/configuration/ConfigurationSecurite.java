package com.sunuxam.configuration;

import com.sunuxam.securite.FiltreAuthentificationJwt;
import com.sunuxam.securite.GestionnaireAccesRefuse;
import com.sunuxam.securite.PointEntreeAuthentification;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;


@Configuration
@EnableWebSecurity
@EnableMethodSecurity
public class ConfigurationSecurite {

    private static final String[] CHEMINS_PUBLICS = {
            "/api/authentification/**",
            "/swagger-ui/**",
            "/swagger-ui.html",
            "/api-docs/**",
            "/v3/api-docs/**",
            "/error"
    };

    /** Origines du frontend Angular en developpement. A adapter pour la production. */
    private static final List<String> ORIGINES_FRONTEND = List.of(
            "http://localhost:4200",
            "http://127.0.0.1:4200"
    );

    private final FiltreAuthentificationJwt filtreAuthentificationJwt;
    private final PointEntreeAuthentification pointEntreeAuthentification;
    private final GestionnaireAccesRefuse gestionnaireAccesRefuse;

    public ConfigurationSecurite(FiltreAuthentificationJwt filtreAuthentificationJwt,
                                 PointEntreeAuthentification pointEntreeAuthentification,
                                 GestionnaireAccesRefuse gestionnaireAccesRefuse) {
        this.filtreAuthentificationJwt = filtreAuthentificationJwt;
        this.pointEntreeAuthentification = pointEntreeAuthentification;
        this.gestionnaireAccesRefuse = gestionnaireAccesRefuse;
    }

    @Bean
    public SecurityFilterChain chaineDeFiltres(HttpSecurity http,
                                               CorsConfigurationSource sourceConfigurationCors) throws Exception {
        http
                .cors(cors -> cors.configurationSource(sourceConfigurationCors))
                .csrf(AbstractHttpConfigurer::disable)
                .formLogin(AbstractHttpConfigurer::disable)
                .httpBasic(AbstractHttpConfigurer::disable)
                .sessionManagement(gestion ->
                        gestion.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(autorisation -> autorisation
                        .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()
                        .requestMatchers(CHEMINS_PUBLICS).permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/concours/ouverts", "/api/concours/*").permitAll()
                        .anyRequest().authenticated())
                .exceptionHandling(gestion -> gestion
                        .authenticationEntryPoint(pointEntreeAuthentification)
                        .accessDeniedHandler(gestionnaireAccesRefuse))
                .addFilterBefore(filtreAuthentificationJwt, UsernamePasswordAuthenticationFilter.class);
        return http.build();
    }

    @Bean
    public CorsConfigurationSource sourceConfigurationCors() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(ORIGINES_FRONTEND);
        configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(List.of("*"));
        configuration.setExposedHeaders(List.of("Location", "Authorization"));
        configuration.setMaxAge(3600L);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}
