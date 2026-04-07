package com.neo4flix.filmservice.mapper;

import com.neo4flix.filmservice.dto.GenreDTO;
import com.neo4flix.filmservice.dto.MovieDTO;
import com.neo4flix.filmservice.entity.Genre;
import com.neo4flix.filmservice.entity.Movie;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Mapper(componentModel = "spring")
public interface MovieMapper {
    
    @Mapping(target = "genres", source = "genres")
    MovieDTO toDTO(Movie movie);
    
    @Mapping(target = "genres", source = "genres")
    Movie toEntity(MovieDTO dto);
    
    GenreDTO genreToDTO(Genre genre);
    
    Genre genreToEntity(GenreDTO dto);
    
    default List<GenreDTO> genresToGenreDTOs(Set<Genre> genres) {
        if (genres == null) {
            return List.of();
        }
        return genres.stream()
                .map(this::genreToDTO)
                .collect(Collectors.toList());
    }
    
    default Set<Genre> genreDTOsToGenres(List<GenreDTO> genreDTOs) {
        if (genreDTOs == null) {
            return new HashSet<>();
        }
        return genreDTOs.stream()
                .map(this::genreToEntity)
                .collect(Collectors.toSet());
    }
}






