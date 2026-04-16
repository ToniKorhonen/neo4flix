package com.neo4flix.ratingservice.service;

import com.neo4flix.ratingservice.dto.AverageRatingDTO;
import com.neo4flix.ratingservice.dto.RatingDTO;
import com.neo4flix.ratingservice.entity.Rating;
import com.neo4flix.ratingservice.repository.RatingJpaRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class RatingService {
    
    private final RatingJpaRepository ratingRepository;
    
    public RatingDTO getRatingByUserAndMovie(Long userId, Long movieId) {
        try {
            log.info("Fetching rating for user {} and movie {}", userId, movieId);
            Optional<Rating> rating = ratingRepository.findByUserIdAndMovieId(userId, movieId);
            
            if (rating.isEmpty()) {
                log.warn("No rating found for user {} and movie {}", userId, movieId);
                return null;
            }
            
            Rating ratingEntity = rating.get();
            return RatingDTO.builder()
                    .userId(ratingEntity.getUserId())
                    .movieId(ratingEntity.getMovieId())
                    .rating(ratingEntity.getRating())
                    .timestamp(ratingEntity.getTimestamp())
                    .build();
        } catch (Exception e) {
            log.error("Error fetching rating", e);
            throw new RuntimeException("Failed to fetch rating: " + e.getMessage(), e);
        }
    }
    
    public List<RatingDTO> getRatingsByUser(Long userId) {
        try {
            log.info("Fetching all ratings for user {}", userId);
            List<Rating> ratings = ratingRepository.findByUserId(userId);
            log.info("Found {} ratings for user {}", ratings.size(), userId);
            
            return ratings.stream()
                    .map(r -> RatingDTO.builder()
                            .userId(r.getUserId())
                            .movieId(r.getMovieId())
                            .rating(r.getRating())
                            .timestamp(r.getTimestamp())
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
            List<Rating> ratings = ratingRepository.findByMovieId(movieId);
            log.info("Found {} ratings for movie {}", ratings.size(), movieId);
            
            return ratings.stream()
                    .map(r -> RatingDTO.builder()
                            .userId(r.getUserId())
                            .movieId(r.getMovieId())
                            .rating(r.getRating())
                            .timestamp(r.getTimestamp())
                            .build())
                    .collect(Collectors.toList());
        } catch (Exception e) {
            log.error("Error fetching ratings for movie", e);
            throw new RuntimeException("Failed to fetch movie ratings: " + e.getMessage(), e);
        }
    }
    
    public AverageRatingDTO getAverageRatingForMovie(Long movieId) {
        try {
            log.info("Fetching average rating for movie {}", movieId);
            List<Rating> ratings = ratingRepository.findByMovieId(movieId);
            
            if (ratings.isEmpty()) {
                log.warn("No ratings found for movie {}", movieId);
                return AverageRatingDTO.builder()
                        .movieId(movieId)
                        .averageRating(null)
                        .totalRatings(0L)
                        .build();
            }
            
            double average = ratings.stream()
                    .mapToInt(Rating::getRating)
                    .average()
                    .orElse(0);
            
            return AverageRatingDTO.builder()
                    .movieId(movieId)
                    .averageRating(Math.round(average * 2) / 2.0)
                    .totalRatings((long) ratings.size())
                    .build();
        } catch (Exception e) {
            log.error("Error fetching average rating for movie", e);
            throw new RuntimeException("Failed to fetch average rating: " + e.getMessage(), e);
        }
    }
    
    public List<AverageRatingDTO> getAverageRatingsForAllMovies() {
        try {
            log.info("Fetching average ratings for all movies");
            List<Rating> ratings = ratingRepository.findAll();
            
            // Grouper par movie et calculer les moyennes
            var movieRatings = ratings.stream()
                    .collect(Collectors.groupingBy(
                            Rating::getMovieId,
                            Collectors.collectingAndThen(
                                    Collectors.toList(),
                                    list -> {
                                        double average = list.stream()
                                                .mapToInt(Rating::getRating)
                                                .average()
                                                .orElse(0);
                                        return AverageRatingDTO.builder()
                                                .movieId(list.get(0).getMovieId())
                                                .averageRating(Math.round(average * 2) / 2.0)
                                                .totalRatings((long) list.size())
                                                .build();
                                    }
                            )
                    ));
            
            log.info("Found average ratings for {} movies", movieRatings.size());
            return movieRatings.values().stream().collect(Collectors.toList());
        } catch (Exception e) {
            log.error("Error fetching average ratings for all movies", e);
            throw new RuntimeException("Failed to fetch average ratings: " + e.getMessage(), e);
        }
    }

    public RatingDTO createRating(Long userId, Long movieId, RatingDTO ratingDTO) {
        try {
            log.info("Creating rating for user {} on movie {} with score {}", userId, movieId, ratingDTO.getRating());
            
            if (ratingDTO.getRating() < 1 || ratingDTO.getRating() > 5) {
                throw new IllegalArgumentException("Rating must be between 1 and 5");
            }
            
            Long timestamp = System.currentTimeMillis();
            
            // Chercher si une note existe déjà
            Optional<Rating> existingRating = ratingRepository.findByUserIdAndMovieId(userId, movieId);
            
            Rating rating;
            if (existingRating.isPresent()) {
                // Mettre à jour la note existante
                rating = existingRating.get();
                rating.setRating(ratingDTO.getRating());
                rating.setTimestamp(timestamp);
                log.info("Updating existing rating");
            } else {
                // Créer une nouvelle note
                rating = Rating.builder()
                        .userId(userId)
                        .movieId(movieId)
                        .rating(ratingDTO.getRating())
                        .timestamp(timestamp)
                        .build();
                log.info("Creating new rating");
            }
            
            Rating savedRating = ratingRepository.save(rating);
            
            return RatingDTO.builder()
                    .userId(savedRating.getUserId())
                    .movieId(savedRating.getMovieId())
                    .rating(savedRating.getRating())
                    .timestamp(savedRating.getTimestamp())
                    .build();
        } catch (Exception e) {
            log.error("Error creating rating", e);
            throw new RuntimeException("Failed to create rating: " + e.getMessage(), e);
        }
    }

    public void deleteRating(Long userId, Long movieId) {
        try {
            log.info("Deleting rating for user {} on movie {}", userId, movieId);
            Optional<Rating> rating = ratingRepository.findByUserIdAndMovieId(userId, movieId);
            
            if (rating.isPresent()) {
                ratingRepository.delete(rating.get());
                log.info("Rating deleted successfully");
            } else {
                log.warn("No rating found to delete for user {} and movie {}", userId, movieId);
            }
        } catch (Exception e) {
            log.error("Error deleting rating", e);
            throw new RuntimeException("Failed to delete rating: " + e.getMessage(), e);
        }
    }
}
