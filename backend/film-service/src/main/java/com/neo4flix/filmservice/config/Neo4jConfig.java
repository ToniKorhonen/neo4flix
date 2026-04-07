package com.neo4flix.filmservice.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.data.neo4j.repository.config.EnableNeo4jRepositories;

@Configuration
@EnableNeo4jRepositories(basePackages = "com.neo4flix.filmservice.repository")
public class Neo4jConfig {

}

