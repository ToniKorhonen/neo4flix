package com.neo4flix.filmservice.repository;

import com.neo4flix.filmservice.entity.Movie;
import org.springframework.data.neo4j.repository.Neo4jRepository;
import org.springframework.data.neo4j.repository.query.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@Repository
public interface MovieRepository extends Neo4jRepository<Movie, Long> {
    
    @Query("MATCH (m:Movie) RETURN m")
    List<Movie> findAllMovies();
    
    @Query("MATCH (m:Movie) RETURN m ORDER BY m.id SKIP $skip LIMIT $limit")
    List<Movie> findMoviesPaginated(@Param("skip") long skip, @Param("limit") long limit);
    
    @Query("MATCH (m:Movie) RETURN count(m) AS count")
    long countAllMovies();
    
    @Query("MATCH (m:Movie) WHERE m.id = $id RETURN m")
    Optional<Movie> findMovieById(@Param("id") Long id);
    
    @Query("MATCH (m:Movie) WHERE m.title CONTAINS $title RETURN m")
    List<Movie> findByTitleContains(@Param("title") String title);

    @Query("MATCH (m:Movie) WHERE m.title CONTAINS $title RETURN m ORDER BY m.id SKIP $skip LIMIT $limit")
    List<Movie> findByTitleContainsPaginated(@Param("title") String title, @Param("skip") long skip, @Param("limit") long limit);

    @Query("MATCH (m:Movie) WHERE m.title CONTAINS $title RETURN count(m) AS count")
    long countByTitleContains(@Param("title") String title);
    
    @Query("MATCH (m:Movie)-[:HAS_GENRE]->(g:Genre) WHERE g.name = $genreName RETURN m")
    List<Movie> findByGenre(@Param("genreName") String genreName);
    
    @Query("MATCH (m:Movie {id: $id})-[:HAS_GENRE]->(g:Genre) RETURN {id: g.id, name: g.name} AS genre")
    List<Map<String, Object>> findGenresForMovie(@Param("id") Long id);
}



