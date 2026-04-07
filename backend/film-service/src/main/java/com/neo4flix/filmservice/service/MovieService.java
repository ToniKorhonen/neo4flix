package com.neo4flix.filmservice.service;

import com.neo4flix.filmservice.dto.MovieDTO;
import com.neo4flix.filmservice.entity.Movie;
import com.neo4flix.filmservice.mapper.MovieMapper;
import com.neo4flix.filmservice.repository.MovieRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class MovieService {
    
    private final MovieRepository movieRepository;
    private final MovieMapper movieMapper;
    
    @Cacheable("movies")
    public List<MovieDTO> getAllMovies() {
        try {
            log.info("Fetching all movies from Neo4j");
            List<Movie> movies = movieRepository.findAllMovies();
            log.info("Found {} movies", movies.size());
            
            if (movies.isEmpty()) {
                log.warn("No movies found in Neo4j database");
            }
            
            List<MovieDTO> result = movies.stream()
                    .map(movie -> {
                        log.debug("Mapping movie: id={}, title={}, genres={}", 
                            movie.getId(), movie.getTitle(), 
                            movie.getGenres() != null ? movie.getGenres().size() : 0);
                        return movieMapper.toDTO(movie);
                    })
                    .collect(Collectors.toList());
            
            log.info("Successfully mapped {} movies to DTOs", result.size());
            return result;
        } catch (Exception e) {
            log.error("Error fetching movies from Neo4j", e);
            throw new RuntimeException("Failed to fetch movies: " + e.getMessage(), e);
        }
    }
    
    public List<MovieDTO> searchMoviesByTitle(String title) {
        try {
            log.info("Searching movies by title: {}", title);
            List<Movie> movies = movieRepository.findByTitleContains(title);
            log.info("Found {} movies matching title '{}'", movies.size(), title);
            return movies.stream()
                    .map(movieMapper::toDTO)
                    .collect(Collectors.toList());
        } catch (Exception e) {
            log.error("Error searching movies by title", e);
            throw new RuntimeException("Failed to search movies: " + e.getMessage(), e);
        }
    }
    
    public List<MovieDTO> findMoviesByGenre(String genreName) {
        try {
            log.info("Finding movies by genre: {}", genreName);
            List<Movie> movies = movieRepository.findByGenre(genreName);
            log.info("Found {} movies in genre '{}'", movies.size(), genreName);
            return movies.stream()
                    .map(movieMapper::toDTO)
                    .collect(Collectors.toList());
        } catch (Exception e) {
            log.error("Error finding movies by genre", e);
            throw new RuntimeException("Failed to find movies by genre: " + e.getMessage(), e);
        }
    }
}

