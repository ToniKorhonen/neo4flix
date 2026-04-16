package com.neo4flix.ratingservice.repository;

import com.neo4flix.ratingservice.entity.RatingRelation;
import org.springframework.data.neo4j.repository.Neo4jRepository;
import org.springframework.stereotype.Repository;

// Note: Les ratings sont maintenant stockées dans PostgreSQL via RatingJpaRepository
// Ce repository Neo4j est conservé à titre de référence pour les futures extensions
@Repository
public interface RatingRepository extends Neo4jRepository<RatingRelation, Long> {
    // Deprecated: Toutes les opérations sont maintenant gérées par RatingJpaRepository
}


