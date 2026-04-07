package com.neo4flix.filmservice.config;

import org.springframework.context.annotation.Configuration;

/**
 * CORS est géré par l'API Gateway (port 8080).
 * Les microservices ne doivent pas ajouter leurs propres headers CORS
 * pour éviter les doublons qui causent des erreurs.
 */
@Configuration
public class CorsConfig {
    // Configuration CORS disabled - handled by API Gateway
}


