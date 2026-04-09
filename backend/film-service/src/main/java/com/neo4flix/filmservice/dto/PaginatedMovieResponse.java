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
public class PaginatedMovieResponse {
    private List<MovieDTO> content;
    private long totalElements;
    private int totalPages;
    private int currentPage;
    private int pageSize;
}

