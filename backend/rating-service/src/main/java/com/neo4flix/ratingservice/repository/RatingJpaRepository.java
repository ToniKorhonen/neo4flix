package com.neo4flix.ratingservice.repository;

import com.neo4flix.ratingservice.entity.Rating;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface RatingJpaRepository extends JpaRepository<Rating, Long> {
    
    Optional<Rating> findByUserIdAndMovieId(Long userId, Long movieId);
    
    List<Rating> findByUserId(Long userId);
    
    List<Rating> findByMovieId(Long movieId);
}


