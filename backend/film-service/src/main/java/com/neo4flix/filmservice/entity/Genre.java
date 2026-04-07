package com.neo4flix.filmservice.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.neo4j.core.schema.Id;
import org.springframework.data.neo4j.core.schema.Node;
import org.springframework.data.neo4j.core.schema.Property;

@Node("Genre")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Genre {
    
    @Id
    private Long id;
    
    @Property("name")
    private String name;
}


