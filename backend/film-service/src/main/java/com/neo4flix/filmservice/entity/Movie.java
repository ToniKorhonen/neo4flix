package com.neo4flix.filmservice.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.neo4j.core.schema.Id;
import org.springframework.data.neo4j.core.schema.Node;
import org.springframework.data.neo4j.core.schema.Property;
import org.springframework.data.neo4j.core.schema.Relationship;

import java.util.Set;

@Node("Movie")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Movie {
    
    @Id
    private Long id;
    
    @Property("title")
    private String title;
    
    @Property("releaseDate")
    private String releaseDate;
    
    @Property("poster")
    private String poster;
    
    @Property("description")
    private String description;
    
    @Relationship(type = "HAS_GENRE", direction = Relationship.Direction.OUTGOING)
    private Set<Genre> genres;
}


