import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { FilmService } from '@app/shared/services/film.service';

interface Film {
  id: number;
  title: string;
  releaseDate: string;
  genre?: string;
  rating?: number;
  description?: string;
  director?: string;
  cast?: string;
  duration?: number;
  poster?: string;
  year?: number;
}

@Component({
  selector: 'app-film-detail',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './film-detail.component.html',
  styleUrls: ['./film-detail.component.scss']
})
export class FilmDetailComponent implements OnInit {
  film: Film | null = null;
  filmId: number = 0;
  loading: boolean = false;
  error: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private filmService: FilmService
  ) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.filmId = params['id'];
      this.loadFilm();
    });
  }

  loadFilm() {
    this.loading = true;
    this.error = null;
    this.filmService.getFilmById(this.filmId.toString()).subscribe({
      next: (data: any) => {
        this.film = {
          id: data.id,
          title: data.title,
          releaseDate: data.releaseDate,
          year: data.year,
          genre: data.genres?.map((g: any) => g.name).join(', ') || 'Unknown',
          rating: data.rating,
          description: data.description,
          director: data.director,
          cast: data.cast,
          duration: data.duration,
          poster: data.poster || 'https://via.placeholder.com/300x450?text=' + encodeURIComponent(data.title)
        };
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading film:', err);
        this.error = 'Erreur lors du chargement du film';
        this.loading = false;
      }
    });
  }
}

