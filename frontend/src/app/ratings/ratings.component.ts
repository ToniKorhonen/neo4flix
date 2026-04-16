import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { RatingService } from '@app/shared/services/rating.service';
import { FilmService } from '@app/shared/services/film.service';
import { AuthService } from '@app/shared/services/auth.service';
import { Subscription } from 'rxjs';
interface Film {
  id: number;
  title: string;
  genre?: string;
  releaseDate?: string;
  genres?: Array<{ id: number; name: string }>;
  poster?: string;
}
interface UserRating {
  movieId: number;
  rating: number;
}
@Component({
  selector: 'app-ratings',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './ratings.component.html',
  styleUrls: ['./ratings.component.scss']
})
export class RatingsComponent implements OnInit, OnDestroy {
  films: Film[] = [];
  selectedFilm: Film | null = null;
  userRating: UserRating = { movieId: 0, rating: 0 };
  ratedFilms: Map<number, number> = new Map();
  hoverRating: number = 0;
  
  // Pagination
  currentPage: number = 1;
  pageSize: number = 30;
  totalPages: number = 1;
  totalElements: number = 0;
  
  userId: number | null = null;
  private userIdSubscription: Subscription | null = null;
  isLoading: boolean = false;
  isSubmitting: boolean = false;
  error: string | null = null;
  successMessage: string | null = null;
  constructor(
    private route: ActivatedRoute,
    private ratingService: RatingService,
    private filmService: FilmService,
    private authService: AuthService
  ) {}
  ngOnInit() {
    this.userIdSubscription = this.authService.userId$.subscribe(userId => {
      this.userId = userId;
      this.loadFilms();
      if (userId) {
        this.loadUserRatings(userId);
      }
    });
    const currentUserId = this.authService.getCurrentUserId();
    if (currentUserId && !this.userId) {
      this.userId = currentUserId;
      this.loadFilms();
      this.loadUserRatings(currentUserId);
    }
  }
  ngOnDestroy() {
    if (this.userIdSubscription) {
      this.userIdSubscription.unsubscribe();
    }
  }
  loadUserRatings(userId: number) {
    this.ratingService.getUserRatings(userId).subscribe({
      next: (ratings: any[]) => {
        // Créer une Map des notes par movieId
        this.ratedFilms.clear();
        ratings.forEach(rating => {
          this.ratedFilms.set(rating.movieId, rating.rating);
        });
        console.log('User ratings loaded:', this.ratedFilms);
      },
      error: (err) => {
        console.error('Error loading user ratings:', err);
        // Ce n'est pas fatal, on continue sans les notes
      }
    });
  }

  loadFilms() {
    this.isLoading = true;
    this.error = null;
    this.filmService.getFilmsPaginated(this.currentPage, this.pageSize).subscribe({
      next: (response: any) => {
        this.films = response.content.map((film: any) => ({
          id: film.id,
          title: film.title,
          releaseDate: film.releaseDate,
          genre: film.genres?.map((g: any) => g.name).join(', ') || 'Unknown',
          poster: film.poster || 'https://via.placeholder.com/150x225?text=' + encodeURIComponent(film.title)
        }));
        this.totalPages = response.totalPages;
        this.totalElements = response.totalElements;
        this.currentPage = response.currentPage;
        this.isLoading = false;
        window.scrollTo(0, 0);
      },
      error: (err) => {
        console.error('Error loading films:', err);
        this.error = 'Erreur lors du chargement des films';
        this.isLoading = false;
      }
    });
  }
  selectFilm(film: Film) {
    this.selectedFilm = film;
    const existingRating = this.ratedFilms.get(film.id);
    this.userRating = { 
      movieId: film.id, 
      rating: existingRating || 0 
    };
    this.hoverRating = 0;
  }
  setRating(rating: number) {
    this.userRating.rating = rating;
  }
  setHoverRating(rating: number) {
    this.hoverRating = rating;
  }
  clearHoverRating() {
    this.hoverRating = 0;
  }
  submitRating() {
    if (!this.userId) {
      this.error = 'Erreur: userId non disponible';
      return;
    }
    if (this.userRating.rating === 0) {
      this.error = 'Veuillez sélectionner une note (1-5)';
      return;
    }
    this.isSubmitting = true;
    this.error = null;
    this.successMessage = null;
    this.ratingService.rateMovie(this.userId, this.userRating.movieId, this.userRating.rating).subscribe({
      next: (response) => {
        this.ratedFilms.set(this.userRating.movieId, this.userRating.rating);
        this.successMessage = `Film noté ${this.userRating.rating}/5!`;
        this.isSubmitting = false;
        setTimeout(() => {
          this.resetForm();
          this.successMessage = null;
          // Recharger les notes pour s'assurer que tout est à jour
          if (this.userId) {
            this.loadUserRatings(this.userId);
          }
        }, 1500);
      },
      error: (err) => {
        console.error('Error rating movie:', err);
        this.error = err.error?.message || 'Erreur lors de l\'enregistrement de la note';
        this.isSubmitting = false;
      }
    });
  }
  resetForm() {
    this.selectedFilm = null;
    this.userRating = { movieId: 0, rating: 0 };
    this.hoverRating = 0;
  }
  getRatingForFilm(filmId: number): number | undefined {
    return this.ratedFilms.get(filmId);
  }
  deleteRating(filmId: number) {
    if (!this.userId) {
      this.error = 'Erreur: userId non disponible';
      return;
    }
    
    if (confirm('Êtes-vous sûr de vouloir supprimer cette note ?')) {
      this.ratingService.deleteRating(this.userId, filmId).subscribe({
        next: () => {
          this.ratedFilms.delete(filmId);
          this.successMessage = 'Note supprimée avec succès';
          setTimeout(() => {
            this.successMessage = null;
            // Recharger les notes
            if (this.userId) {
              this.loadUserRatings(this.userId);
            }
          }, 1500);
        },
        error: (err) => {
          console.error('Error deleting rating:', err);
          this.error = 'Erreur lors de la suppression de la note';
        }
      });
    }
  }
  getFilmTitle(filmId: number): string {
    const film = this.films.find(f => f.id === filmId);
    return film ? film.title : 'Film inconnu';
  }
  getStars(): number[] {
    return [1, 2, 3, 4, 5];
  }

  goToPage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.loadFilms();
    }
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.loadFilms();
    }
  }

  previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.loadFilms();
    }
  }

  getPageNumbers(): number[] {
    const pages: number[] = [];
    const range = 5;
    let start = Math.max(1, this.currentPage - range);
    let end = Math.min(this.totalPages, this.currentPage + range);
    
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    return pages;
  }
}
