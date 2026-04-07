import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { FilmService } from '@app/shared/services/film.service';

interface Film {
  id: number;
  title: string;
  releaseDate: string;
  genres?: Array<{ id: number; name: string }>;
  genre?: string;
  rating?: number;
  poster?: string;
  description?: string;
}

@Component({
  selector: 'app-films',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './films.component.html',
  styleUrls: ['./films.component.scss']
})
export class FilmsComponent implements OnInit {
  films: Film[] = [];
  filteredFilms: Film[] = [];
  searchQuery: string = '';
  loading: boolean = false;

  constructor(private filmService: FilmService) {}

  ngOnInit() {
    this.loadFilms();
  }

  loadFilms() {
    this.loading = true;
    this.filmService.getFilms().subscribe({
      next: (data: any[]) => {
        this.films = data.map(film => ({
          id: film.id,
          title: film.title,
          releaseDate: film.releaseDate,
          genres: film.genres,
          genre: film.genres?.map((g: any) => g.name).join(', ') || 'Unknown',
          rating: film.rating,
          poster: film.poster || 'https://via.placeholder.com/300x450?text=' + encodeURIComponent(film.title),
          description: film.description
        }));
        this.filteredFilms = [...this.films];
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading films:', err);
        this.loading = false;
      }
    });
  }

  searchFilms() {
    const query = this.searchQuery.toLowerCase();
    if (!query) {
      this.filteredFilms = [...this.films];
    } else {
      this.filteredFilms = this.films.filter(film =>
        film.title.toLowerCase().includes(query) ||
        (film.genre?.toLowerCase().includes(query) ?? false)
      );
    }
  }
}

