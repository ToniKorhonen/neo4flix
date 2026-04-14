package com.neo4flix.ratingservice.repository;

import com.neo4flix.ratingservice.entity.RatingRelation;
import org.springframework.data.neo4j.repository.Neo4jRepository;
import org.springframework.data.neo4j.repository.query.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@Repository
public interface RatingRepository extends Neo4jRepository<RatingRelation, Long> {
    
    @Query("MATCH (u:User {id: $userId})-[r:RATED]->(m:Movie {id: $movieId}) RETURN r.rating AS rating, r.timestamp AS timestamp")
    Optional<Map<String, Object>> findRatingByUserAndMovie(@Param("userId") Long userId, @Param("movieId") Long movieId);
    
    @Query("MATCH (u:User {id: $userId})-[r:RATED]->(m:Movie) RETURN m.id AS movieId, r.rating AS rating, r.timestamp AS timestamp ORDER BY r.timestamp DESC")
    List<Map<String, Object>> findRatingsByUser(@Param("userId") Long userId);
    
    @Query("MATCH (u:User)-[r:RATED]->(m:Movie {id: $movieId}) RETURN u.id AS userId, r.rating AS rating, r.timestamp AS timestamp")
    List<Map<String, Object>> findRatingsByMovie(@Param("movieId") Long movieId);
    
    @Query("MATCH (u:User)-[r:RATED]->(m:Movie {id: $movieId}) RETURN AVG(r.rating) AS averageRating, COUNT(r) AS totalRatings")
    Optional<Map<String, Object>> findAverageRatingForMovie(@Param("movieId") Long movieId);
    
    @Query("MATCH (u:User)-[r:RATED]->(m:Movie) RETURN m.id AS movieId, AVG(r.rating) AS averageRating, COUNT(r) AS totalRatings ORDER BY m.id")
    List<Map<String, Object>> findAverageRatingsForAllMovies();
    
    @Query("MATCH (u:User {id: $userId})-[r:RATED]->(m:Movie) RETURN COUNT(r) AS count")
    long countRatingsByUser(@Param("userId") Long userId);
}


