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
  allFilms: Film[] = [];
  searchQuery: string = '';
  loading: boolean = false;
  isSearching: boolean = false;
  
  // Filtres
  titleFilter: string = '';
  selectedYear: string = '';
  selectedGenres: Set<string> = new Set();
  allGenres: Array<{ id: number; name: string }> = [];
  availableYears: number[] = [];
  
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
    this.loadAllFilms();
  }

  loadAllFilms() {
    this.loading = true;
    
    this.filmService.getFilms().subscribe({
      next: (response: any) => {
        this.allFilms = response.map((film: any) => ({
          id: film.id,
          title: film.title,
          releaseDate: film.releaseDate,
          genres: film.genres,
          genre: film.genres?.map((g: any) => g.name).join(', ') || 'Unknown',
          rating: film.rating,
          poster: film.poster || 'https://via.placeholder.com/300x450?text=' + encodeURIComponent(film.title),
          description: film.description
        }));
        
        this.extractGenresAndYears();
        this.applyFilters();
        this.loading = false;
        window.scrollTo(0, 0);
      },
      error: (err) => {
        console.error('Error loading films:', err);
        this.loading = false;
      }
    });
  }

  extractGenresAndYears() {
    const genresSet = new Set<string>();
    const yearsSet = new Set<number>();
    
    this.allFilms.forEach(film => {
      if (film.genres && film.genres.length > 0) {
        film.genres.forEach(g => {
          genresSet.add(g.name);
        });
      }
      
      if (film.releaseDate) {
        const year = parseInt(film.releaseDate.split('-')[2], 10);
        if (!isNaN(year)) {
          yearsSet.add(year);
        }
      }
    });
    
    this.allGenres = Array.from(genresSet)
      .map((name, index) => ({ id: index, name }))
      .sort((a, b) => a.name.localeCompare(b.name));
    
    this.availableYears = Array.from(yearsSet).sort((a, b) => b - a);
  }

  applyFilters() {
    let filteredFilms = this.allFilms.filter(film => {
      // Filtre par titre
      if (this.titleFilter.trim()) {
        if (!film.title.toLowerCase().includes(this.titleFilter.toLowerCase())) {
          return false;
        }
      }

      // Filtre par année
      if (this.selectedYear.trim()) {
        const selectedYearNum = parseInt(this.selectedYear, 10);
        const filmYear = parseInt(film.releaseDate?.split('-')[2] || '', 10);
        if (filmYear !== selectedYearNum) {
          return false;
        }
      }

      // Filtre par genres
      if (this.selectedGenres.size > 0) {
        const filmGenres = film.genres?.map(g => g.name) || [];
        const hasGenre = Array.from(this.selectedGenres).some(selectedGenre =>
          filmGenres.includes(selectedGenre)
        );
        if (!hasGenre) {
          return false;
        }
      }

      return true;
    });

    this.totalElements = filteredFilms.length;
    this.totalPages = Math.ceil(this.totalElements / this.itemsPerPage);
    this.currentPage = 1;
    this.paginateResults(filteredFilms);
  }

  paginateResults(films: Film[]) {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.paginatedFilms = films.slice(startIndex, endIndex);
  }

  onTitleFilterChange() {
    if (this.searchTimeout) {
      clearTimeout(this.searchTimeout);
    }
    this.searchTimeout = setTimeout(() => {
      this.applyFilters();
    }, 300);
  }

  onYearFilterChange() {
    this.applyFilters();
  }

  toggleGenre(genreName: string) {
    if (this.selectedGenres.has(genreName)) {
      this.selectedGenres.delete(genreName);
    } else {
      this.selectedGenres.add(genreName);
    }
    this.applyFilters();
  }

  isGenreSelected(genreName: string): boolean {
    return this.selectedGenres.has(genreName);
  }

  clearFilters() {
    this.titleFilter = '';
    this.selectedYear = '';
    this.selectedGenres.clear();
    this.applyFilters();
  }

  goToPage(pageNumber: number) {
    if (pageNumber < 1 || pageNumber > this.totalPages) {
      return;
    }
    this.currentPage = pageNumber;
    
    // Réappliquer les filtres pour obtenir les films filtrés et paginer
    let filteredFilms = this.allFilms.filter(film => {
      // Filtre par titre
      if (this.titleFilter.trim()) {
        if (!film.title.toLowerCase().includes(this.titleFilter.toLowerCase())) {
          return false;
        }
      }

      // Filtre par année
      if (this.selectedYear.trim()) {
        const selectedYearNum = parseInt(this.selectedYear, 10);
        const filmYear = parseInt(film.releaseDate?.split('-')[2] || '', 10);
        if (filmYear !== selectedYearNum) {
          return false;
        }
      }

      // Filtre par genres
      if (this.selectedGenres.size > 0) {
        const filmGenres = film.genres?.map(g => g.name) || [];
        const hasGenre = Array.from(this.selectedGenres).some(selectedGenre =>
          filmGenres.includes(selectedGenre)
        );
        if (!hasGenre) {
          return false;
        }
      }

      return true;
    });

    this.paginateResults(filteredFilms);
    window.scrollTo(0, 0);
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

