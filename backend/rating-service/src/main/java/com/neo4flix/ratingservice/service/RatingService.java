package com.neo4flix.ratingservice.service;

import com.neo4flix.ratingservice.dto.AverageRatingDTO;
import com.neo4flix.ratingservice.dto.RatingDTO;
import com.neo4flix.ratingservice.repository.RatingRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class RatingService {
    
    private final RatingRepository ratingRepository;
    
    public RatingDTO getRatingByUserAndMovie(Long userId, Long movieId) {
        try {
            log.info("Fetching rating for user {} and movie {}", userId, movieId);
            Optional<Map<String, Object>> rating = ratingRepository.findRatingByUserAndMovie(userId, movieId);
            
            if (rating.isEmpty()) {
                log.warn("No rating found for user {} and movie {}", userId, movieId);
                return null;
            }
            
            Map<String, Object> ratingMap = rating.get();
            return RatingDTO.builder()
                    .userId(userId)
                    .movieId(movieId)
                    .rating(((Number) ratingMap.get("rating")).intValue())
                    .timestamp(((Number) ratingMap.get("timestamp")).longValue())
                    .build();
        } catch (Exception e) {
            log.error("Error fetching rating", e);
            throw new RuntimeException("Failed to fetch rating: " + e.getMessage(), e);
        }
    }
    
    public List<RatingDTO> getRatingsByUser(Long userId) {
        try {
            log.info("Fetching all ratings for user {}", userId);
            List<Map<String, Object>> ratings = ratingRepository.findRatingsByUser(userId);
            log.info("Found {} ratings for user {}", ratings.size(), userId);
            
            return ratings.stream()
                    .map(ratingMap -> RatingDTO.builder()
                            .userId(userId)
                            .movieId(((Number) ratingMap.get("movieId")).longValue())
                            .rating(((Number) ratingMap.get("rating")).intValue())
                            .timestamp(((Number) ratingMap.get("timestamp")).longValue())
                            .build())
                    .collect(Collectors.toList());
        } catch (Exception e) {
            log.error("Error fetching ratings for user", e);
            throw new RuntimeException("Failed to fetch user ratings: " + e.getMessage(), e);
        }
    }
    
    public List<RatingDTO> getRatingsByMovie(Long movieId) {
        try {
            log.info("Fetching all ratings for movie {}", movieId);
            List<Map<String, Object>> ratings = ratingRepository.findRatingsByMovie(movieId);
            log.info("Found {} ratings for movie {}", ratings.size(), movieId);
            
            return ratings.stream()
                    .map(ratingMap -> RatingDTO.builder()
                            .userId(((Number) ratingMap.get("userId")).longValue())
                            .movieId(movieId)
                            .rating(((Number) ratingMap.get("rating")).intValue())
                            .timestamp(((Number) ratingMap.get("timestamp")).longValue())
                            .build())
                    .collect(Collectors.toList());
        } catch (Exception e) {
            log.error("Error fetching ratings for movie", e);
            throw new RuntimeException("Failed to fetch movie ratings: " + e.getMessage(), e);
        }
    }
    
    @Cacheable("movieRatings")
    public AverageRatingDTO getAverageRatingForMovie(Long movieId) {
        try {
            log.info("Fetching average rating for movie {}", movieId);
            Optional<Map<String, Object>> avgRating = ratingRepository.findAverageRatingForMovie(movieId);
            
            if (avgRating.isEmpty() || avgRating.get().get("averageRating") == null) {
                log.warn("No ratings found for movie {}", movieId);
                return AverageRatingDTO.builder()
                        .movieId(movieId)
                        .averageRating(null)
                        .totalRatings(0L)
                        .build();
            }
            
            Map<String, Object> ratingMap = avgRating.get();
            Double average = ((Number) ratingMap.get("averageRating")).doubleValue();
            Long count = ((Number) ratingMap.get("totalRatings")).longValue();
            
            return AverageRatingDTO.builder()
                    .movieId(movieId)
                    .averageRating(Math.round(average * 2) / 2.0)
                    .totalRatings(count)
                    .build();
        } catch (Exception e) {
            log.error("Error fetching average rating for movie", e);
            throw new RuntimeException("Failed to fetch average rating: " + e.getMessage(), e);
        }
    }
    
    @Cacheable("allMovieRatings")
    public List<AverageRatingDTO> getAverageRatingsForAllMovies() {
        try {
            log.info("Fetching average ratings for all movies");
            List<Map<String, Object>> ratings = ratingRepository.findAverageRatingsForAllMovies();
            log.info("Found average ratings for {} movies", ratings.size());
            
            return ratings.stream()
                    .map(ratingMap -> {
                        Double average = ((Number) ratingMap.get("averageRating")).doubleValue();
                        return AverageRatingDTO.builder()
                                .movieId(((Number) ratingMap.get("movieId")).longValue())
                                .averageRating(Math.round(average * 2) / 2.0)
                                .totalRatings(((Number) ratingMap.get("totalRatings")).longValue())
                                .build();
                    })
                    .collect(Collectors.toList());
        } catch (Exception e) {
            log.error("Error fetching average ratings for all movies", e);
            throw new RuntimeException("Failed to fetch average ratings: " + e.getMessage(), e);
        }
    }
}

