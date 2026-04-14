package com.neo4flix.ratingservice.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.neo4j.core.schema.GeneratedValue;
import org.springframework.data.neo4j.core.schema.Id;
import org.springframework.data.neo4j.core.schema.RelationshipProperties;
import org.springframework.data.neo4j.core.schema.TargetNode;

@RelationshipProperties
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RatingRelation {
    
    @Id
    @GeneratedValue
    private Long id;
    
    private Integer rating;
    
    private Long timestamp;
    
    @TargetNode
    private MovieNode movie;
    
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class MovieNode {
        private Long id;
    }
}


