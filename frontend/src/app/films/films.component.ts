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
  paginatedFilms: Film[] = [];
  searchQuery: string = '';
  loading: boolean = false;
  
  // Pagination
  currentPage: number = 1;
  itemsPerPage: number = 30;
  totalPages: number = 1;

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
        this.updatePagination();
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
    this.currentPage = 1; // Réinitialiser à la première page
    this.updatePagination();
  }

  updatePagination() {
    this.totalPages = Math.ceil(this.filteredFilms.length / this.itemsPerPage);
    this.goToPage(this.currentPage);
  }

  goToPage(pageNumber: number) {
    if (pageNumber < 1 || pageNumber > this.totalPages) {
      return;
    }
    this.currentPage = pageNumber;
    const startIndex = (pageNumber - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.paginatedFilms = this.filteredFilms.slice(startIndex, endIndex);
    // Scroll to top of page
    window.scrollTo(0, 0);
  }

  previousPage() {
    this.goToPage(this.currentPage - 1);
  }

  nextPage() {
    this.goToPage(this.currentPage + 1);
  }
}

