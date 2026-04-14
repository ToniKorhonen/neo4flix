package com.neo4flix.filmservice.service;

import com.neo4flix.filmservice.dto.MovieDTO;
import com.neo4flix.filmservice.dto.PaginatedMovieResponse;
import com.neo4flix.filmservice.entity.Genre;
import com.neo4flix.filmservice.entity.Movie;
import com.neo4flix.filmservice.mapper.MovieMapper;
import com.neo4flix.filmservice.repository.MovieRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class MovieService {
    
    private final MovieRepository movieRepository;
    private final MovieMapper movieMapper;

    /**
     * Charge le rating moyen pour un film spécifique
     */
    private void enrichMovieWithRating(MovieDTO movieDTO, Long movieId) {
        try {
            Double avgRating = movieRepository.findAverageRatingForMovie(movieId);
            if (avgRating != null) {
                movieDTO.setRating(Math.round(avgRating * 2) / 2.0);
            }
        } catch (Exception e) {
            log.warn("Could not load rating for movie {}: {}", movieId, e.getMessage());
            movieDTO.setRating(null);
        }
    }

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
                        // Charger les genres pour ce movie
                        List<Map<String, Object>> genreMaps = movieRepository.findGenresForMovie(movie.getId());
                        Set<Genre> genres = new HashSet<>();
                        for (Map<String, Object> genreMap : genreMaps) {
                            Genre genre = new Genre();
                            genre.setId(((Number) genreMap.get("id")).longValue());
                            genre.setName((String) genreMap.get("name"));
                            genres.add(genre);
                        }
                        movie.setGenres(genres);
                        MovieDTO dto = movieMapper.toDTO(movie);
                        // Charger le rating moyen
                        enrichMovieWithRating(dto, movie.getId());
                        return dto;
                    })
                    .collect(Collectors.toList());
            
            log.info("Successfully mapped {} movies to DTOs with ratings", result.size());
            return result;
        } catch (Exception e) {
            log.error("Error fetching movies from Neo4j", e);
            throw new RuntimeException("Failed to fetch movies: " + e.getMessage(), e);
        }
    }

    public MovieDTO getMovieById(Long id) {
        try {
            log.info("Fetching movie with id: {}", id);
            Optional<Movie> movie = movieRepository.findMovieById(id);
            
            if (movie.isEmpty()) {
                log.warn("Movie with id {} not found", id);
                throw new RuntimeException("Movie not found with id: " + id);
            }
            
            Movie foundMovie = movie.get();
            
            // Charger les genres pour ce movie
            List<Map<String, Object>> genreMaps = movieRepository.findGenresForMovie(id);
            Set<Genre> genres = new HashSet<>();
            for (Map<String, Object> genreMap : genreMaps) {
                Genre genre = new Genre();
                genre.setId(((Number) genreMap.get("id")).longValue());
                genre.setName((String) genreMap.get("name"));
                genres.add(genre);
            }
            foundMovie.setGenres(genres);
            
            MovieDTO result = movieMapper.toDTO(foundMovie);
            
            // Charger le rating moyen
            try {
                Double avgRating = movieRepository.findAverageRatingForMovie(id);
                if (avgRating != null) {
                    result.setRating(Math.round(avgRating * 2) / 2.0);
                }
            } catch (Exception e) {
                log.warn("Could not load rating for movie {}: {}", id, e.getMessage());
                result.setRating(null);
            }
            
            log.info("Successfully fetched and mapped movie: {} with rating: {}", result.getTitle(), result.getRating());
            return result;
        } catch (Exception e) {
            log.error("Error fetching movie by id", e);
            throw new RuntimeException("Failed to fetch movie: " + e.getMessage(), e);
        }
    }
    
    public List<MovieDTO> searchMoviesByTitle(String title) {
        try {
            log.info("Searching movies by title: {}", title);
            List<Movie> movies = movieRepository.findByTitleContains(title);
            log.info("Found {} movies matching title '{}'", movies.size(), title);
            
            return movies.stream()
                    .map(movie -> {
                        MovieDTO dto = movieMapper.toDTO(movie);
                        enrichMovieWithRating(dto, movie.getId());
                        return dto;
                    })
                    .collect(Collectors.toList());
        } catch (Exception e) {
            log.error("Error searching movies by title", e);
            throw new RuntimeException("Failed to search movies: " + e.getMessage(), e);
        }
    }

    public PaginatedMovieResponse getMoviesPaginated(int page, int pageSize) {
        try {
            log.info("Fetching movies paginated: page={}, pageSize={}", page, pageSize);
            
            long skip = (long) (page - 1) * pageSize;
            List<Movie> movies = movieRepository.findMoviesPaginated(skip, pageSize);
            
            List<MovieDTO> movieDTOs = movies.stream()
                    .map(movie -> {
                        List<Map<String, Object>> genreMaps = movieRepository.findGenresForMovie(movie.getId());
                        Set<Genre> genres = new HashSet<>();
                        for (Map<String, Object> genreMap : genreMaps) {
                            Genre genre = new Genre();
                            genre.setId(((Number) genreMap.get("id")).longValue());
                            genre.setName((String) genreMap.get("name"));
                            genres.add(genre);
                        }
                        movie.setGenres(genres);
                        MovieDTO dto = movieMapper.toDTO(movie);
                        enrichMovieWithRating(dto, movie.getId());
                        return dto;
                    })
                    .collect(Collectors.toList());
            
            long totalElements = movieRepository.countAllMovies();
            int totalPages = (int) Math.ceil((double) totalElements / pageSize);
            
            log.info("Successfully fetched {} movies for page {} with ratings", movieDTOs.size(), page);

            return PaginatedMovieResponse.builder()
                    .content(movieDTOs)
                    .totalElements(totalElements)
                    .totalPages(totalPages)
                    .currentPage(page)
                    .pageSize(pageSize)
                    .build();
        } catch (Exception e) {
            log.error("Error fetching paginated movies", e);
            throw new RuntimeException("Failed to fetch paginated movies: " + e.getMessage(), e);
        }
    }

    public PaginatedMovieResponse searchMoviesPaginated(String title, int page, int pageSize) {
        try {
            log.info("Searching movies paginated: title={}, page={}, pageSize={}", title, page, pageSize);
            
            long skip = (long) (page - 1) * pageSize;
            List<Movie> movies = movieRepository.findByTitleContainsPaginated(title, skip, pageSize);
            
            List<MovieDTO> movieDTOs = movies.stream()
                    .map(movie -> {
                        List<Map<String, Object>> genreMaps = movieRepository.findGenresForMovie(movie.getId());
                        Set<Genre> genres = new HashSet<>();
                        for (Map<String, Object> genreMap : genreMaps) {
                            Genre genre = new Genre();
                            genre.setId(((Number) genreMap.get("id")).longValue());
                            genre.setName((String) genreMap.get("name"));
                            genres.add(genre);
                        }
                        movie.setGenres(genres);
                        MovieDTO dto = movieMapper.toDTO(movie);
                        enrichMovieWithRating(dto, movie.getId());
                        return dto;
                    })
                    .collect(Collectors.toList());
            
            long totalElements = movieRepository.countByTitleContains(title);
            int totalPages = (int) Math.ceil((double) totalElements / pageSize);
            
            log.info("Successfully fetched {} movies for search query '{}' on page {}", movieDTOs.size(), title, page);
            
            return PaginatedMovieResponse.builder()
                    .content(movieDTOs)
                    .totalElements(totalElements)
                    .totalPages(totalPages)
                    .currentPage(page)
                    .pageSize(pageSize)
                    .build();
        } catch (Exception e) {
            log.error("Error searching paginated movies", e);
            throw new RuntimeException("Failed to search paginated movies: " + e.getMessage(), e);
        }
    }

    // ...existing code...

    public List<MovieDTO> findMoviesByGenre(String genreName) {
        try {
            log.info("Finding movies by genre: {}", genreName);
            List<Movie> movies = movieRepository.findByGenre(genreName);
            log.info("Found {} movies in genre '{}'", movies.size(), genreName);
            
            return movies.stream()
                    .map(movie -> {
                        MovieDTO dto = movieMapper.toDTO(movie);
                        enrichMovieWithRating(dto, movie.getId());
                        return dto;
                    })
                    .collect(Collectors.toList());
        } catch (Exception e) {
            log.error("Error finding movies by genre", e);
            throw new RuntimeException("Failed to find movies by genre: " + e.getMessage(), e);
        }
    }
}

