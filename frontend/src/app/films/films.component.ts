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
  paginatedFilms: Film[] = [];
  searchQuery: string = '';
  loading: boolean = false;
  isSearching: boolean = false;
  
  // Pagination
  currentPage: number = 1;
  itemsPerPage: number = 30;
  totalPages: number = 1;
  totalElements: number = 0;
  
  // Debounce timeout
  private searchTimeout: any;

  get pagesToDisplay(): number[] {
    const range = 5;
    const pages: number[] = [];
    
    let start = Math.max(1, this.currentPage - range);
    let end = Math.min(this.totalPages, this.currentPage + range);
    
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    
    return pages;
  }

  constructor(private filmService: FilmService) {}

  ngOnInit() {
    this.loadFilmsForPage(this.currentPage);
  }

  loadFilmsForPage(pageNumber: number) {
    this.loading = true;
    
    let request;
    if (this.isSearching && this.searchQuery.trim() !== '') {
      // Utiliser la recherche paginée
      request = this.filmService.searchFilmsPaginated(this.searchQuery, pageNumber, this.itemsPerPage);
    } else {
      // Utiliser la pagination normale
      request = this.filmService.getFilmsPaginated(pageNumber, this.itemsPerPage);
    }
    
    request.subscribe({
      next: (response: any) => {
        this.paginatedFilms = response.content.map((film: any) => ({
          id: film.id,
          title: film.title,
          releaseDate: film.releaseDate,
          genres: film.genres,
          genre: film.genres?.map((g: any) => g.name).join(', ') || 'Unknown',
          rating: film.rating,
          poster: film.poster || 'https://via.placeholder.com/300x450?text=' + encodeURIComponent(film.title),
          description: film.description
        }));
        this.currentPage = response.currentPage;
        this.totalPages = response.totalPages;
        this.totalElements = response.totalElements;
        this.loading = false;
        window.scrollTo(0, 0);
      },
      error: (err) => {
        console.error('Error loading films:', err);
        this.loading = false;
      }
    });
  }

  searchFilms() {
    // Déclencher la recherche immédiatement (pour le cas où l'utilisateur appuie sur Entrée)
    this.currentPage = 1;
    this.isSearching = this.searchQuery.trim() !== '';
    this.loadFilmsForPage(1);
  }

  onSearchChange() {
    // Effacer le timeout précédent
    if (this.searchTimeout) {
      clearTimeout(this.searchTimeout);
    }

    // Créer un nouveau timeout
    this.searchTimeout = setTimeout(() => {
      this.searchFilms();
    }, 300); // 300ms de délai pour moins de latence
  }

  clearSearch() {
    this.searchQuery = '';
    this.isSearching = false;
    this.currentPage = 1;
    if (this.searchTimeout) {
      clearTimeout(this.searchTimeout);
    }
    this.loadFilmsForPage(1);
  }

  goToPage(pageNumber: number) {
    if (pageNumber < 1 || pageNumber > this.totalPages) {
      return;
    }
    this.loadFilmsForPage(pageNumber);
  }

  goToFirstPage() {
    this.goToPage(1);
  }

  goToLastPage() {
    this.goToPage(this.totalPages);
  }

  previousPage() {
    this.goToPage(this.currentPage - 1);
  }

  nextPage() {
    this.goToPage(this.currentPage + 1);
  }
}

