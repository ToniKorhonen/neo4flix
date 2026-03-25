package com.neo4flix.filmservice;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cache.annotation.EnableCaching;

@SpringBootApplication
@EnableCaching
public class FilmServiceApplication {

    public static void main(String[] args) {
        SpringApplication.run(FilmServiceApplication.class, args);
    }

}

