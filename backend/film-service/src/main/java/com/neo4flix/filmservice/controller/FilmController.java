package com.neo4flix.filmservice.controller;

import com.neo4flix.filmservice.dto.MovieDTO;
import com.neo4flix.filmservice.service.MovieService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/films")
@RequiredArgsConstructor
@Slf4j
public class FilmController {
    
    private final MovieService movieService;
    
    @GetMapping("/health")
    public ResponseEntity<Map<String, String>> health() {
        Map<String, String> response = new HashMap<>();
        response.put("status", "Film Service is running");
        response.put("timestamp", String.valueOf(System.currentTimeMillis()));
        return ResponseEntity.ok(response);
    }
    
    @GetMapping
    public ResponseEntity<List<MovieDTO>> getAllFilms() {
        log.info("GET /films - Retrieving all films");
        List<MovieDTO> films = movieService.getAllMovies();
        return ResponseEntity.ok(films);
    }
    
    @GetMapping("/search")
    public ResponseEntity<List<MovieDTO>> searchFilms(@RequestParam String q) {
        log.info("GET /films/search?q={} - Searching films", q);
        List<MovieDTO> films = movieService.searchMoviesByTitle(q);
        return ResponseEntity.ok(films);
    }
    
    @GetMapping("/genre/{genreName}")
    public ResponseEntity<List<MovieDTO>> getFilmsByGenre(@PathVariable String genreName) {
        log.info("GET /films/genre/{} - Finding films by genre", genreName);
        List<MovieDTO> films = movieService.findMoviesByGenre(genreName);
        return ResponseEntity.ok(films);
    }
}



