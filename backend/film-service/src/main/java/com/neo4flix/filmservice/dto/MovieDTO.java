package com.neo4flix.filmservice.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MovieDTO {
    private Long id;
    private String title;
    private String releaseDate;
    private Integer year;
    private String poster;
    private String description;
    private List<GenreDTO> genres;
    private Double rating;
}

