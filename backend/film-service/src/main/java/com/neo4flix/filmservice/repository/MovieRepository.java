package com.neo4flix.filmservice.repository;

import com.neo4flix.filmservice.entity.Movie;
import org.springframework.data.neo4j.repository.Neo4jRepository;
import org.springframework.data.neo4j.repository.query.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface MovieRepository extends Neo4jRepository<Movie, Long> {
    
    @Query("MATCH (m:Movie) RETURN m ORDER BY m.id")
    List<Movie> findAllMovies();
    
    @Query("MATCH (m:Movie) WHERE m.id = $id RETURN m")
    Optional<Movie> findMovieById(@Param("id") Long id);
    
    @Query("MATCH (m:Movie) WHERE m.title CONTAINS $title RETURN m ORDER BY m.id")
    List<Movie> findByTitleContains(@Param("title") String title);
    
    @Query("MATCH (m:Movie)-[:HAS_GENRE]->(g:Genre) WHERE g.name = $genreName RETURN m ORDER BY m.id")
    List<Movie> findByGenre(@Param("genreName") String genreName);
}



