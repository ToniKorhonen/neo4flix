package com.neo4flix.filmservice.controller;

import com.neo4flix.filmservice.dto.MovieDTO;
import com.neo4flix.filmservice.dto.PaginatedMovieResponse;
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

    @GetMapping("/paginated")
    public ResponseEntity<PaginatedMovieResponse> getFilmsPaginated(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "30") int pageSize) {
        log.info("GET /films/paginated - Retrieving paginated films: page={}, pageSize={}", page, pageSize);
        PaginatedMovieResponse response = movieService.getMoviesPaginated(page, pageSize);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/search/paginated")
    public ResponseEntity<PaginatedMovieResponse> searchFilmsPaginated(
            @RequestParam String q,
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "30") int pageSize) {
        log.info("GET /films/search/paginated?q={} - Searching films paginated: page={}, pageSize={}", q, page, pageSize);
        PaginatedMovieResponse response = movieService.searchMoviesPaginated(q, page, pageSize);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{id}")
    public ResponseEntity<MovieDTO> getFilmById(@PathVariable Long id) {
        log.info("GET /films/{} - Retrieving film by id", id);
        MovieDTO film = movieService.getMovieById(id);
        return ResponseEntity.ok(film);
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



