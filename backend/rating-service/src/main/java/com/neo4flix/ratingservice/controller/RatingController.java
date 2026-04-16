package com.neo4flix.ratingservice.controller;

import com.neo4flix.ratingservice.dto.AverageRatingDTO;
import com.neo4flix.ratingservice.dto.RatingDTO;
import com.neo4flix.ratingservice.service.RatingService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/ratings")
@RequiredArgsConstructor
@Slf4j
public class RatingController {
    
    private final RatingService ratingService;
    
    @GetMapping("/user/{userId}/movie/{movieId}")
    public ResponseEntity<RatingDTO> getRatingByUserAndMovie(@PathVariable Long userId, @PathVariable Long movieId) {
        log.info("GET request: Rating for user {} and movie {}", userId, movieId);
        RatingDTO rating = ratingService.getRatingByUserAndMovie(userId, movieId);
        return ResponseEntity.ok(rating);
    }
    
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<RatingDTO>> getRatingsByUser(@PathVariable Long userId) {
        log.info("GET request: All ratings for user {}", userId);
        List<RatingDTO> ratings = ratingService.getRatingsByUser(userId);
        return ResponseEntity.ok(ratings);
    }
    
    @GetMapping("/movie/{movieId}")
    public ResponseEntity<List<RatingDTO>> getRatingsByMovie(@PathVariable Long movieId) {
        log.info("GET request: All ratings for movie {}", movieId);
        List<RatingDTO> ratings = ratingService.getRatingsByMovie(movieId);
        return ResponseEntity.ok(ratings);
    }
    
    @GetMapping("/movie/{movieId}/average")
    public ResponseEntity<AverageRatingDTO> getAverageRatingForMovie(@PathVariable Long movieId) {
        log.info("GET request: Average rating for movie {}", movieId);
        AverageRatingDTO averageRating = ratingService.getAverageRatingForMovie(movieId);
        return ResponseEntity.ok(averageRating);
    }
    
    @GetMapping("/average")
    public ResponseEntity<List<AverageRatingDTO>> getAverageRatingsForAllMovies() {
        log.info("GET request: Average ratings for all movies");
        List<AverageRatingDTO> averageRatings = ratingService.getAverageRatingsForAllMovies();
        return ResponseEntity.ok(averageRatings);
    }
    
    @PostMapping("/user/{userId}/movie/{movieId}")
    public ResponseEntity<RatingDTO> createRating(@PathVariable Long userId, @PathVariable Long movieId, @RequestBody RatingDTO ratingDTO) {
        log.info("POST request: Create rating for user {} and movie {}", userId, movieId);
        RatingDTO createdRating = ratingService.createRating(userId, movieId, ratingDTO);
        return ResponseEntity.ok(createdRating);
    }

    @DeleteMapping("/user/{userId}/movie/{movieId}")
    public ResponseEntity<Void> deleteRating(@PathVariable Long userId, @PathVariable Long movieId) {
        log.info("DELETE request: Delete rating for user {} and movie {}", userId, movieId);
        ratingService.deleteRating(userId, movieId);
        return ResponseEntity.noContent().build();
    }
}
