import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink, ActivatedRoute } from '@angular/router';

interface Film {
  id: number;
  title: string;
  genre: string;
  releaseDate: string;
  poster?: string;
}

interface UserRating {
  filmId: number;
  rating: number;
  comment: string;
}

@Component({
  selector: 'app-ratings',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './ratings.component.html',
  styleUrls: ['./ratings.component.scss']
})
export class RatingsComponent implements OnInit {
  // ...existing code...
  films: Film[] = [];
  selectedFilm: Film | null = null;
  userRating: UserRating = {
    filmId: 0,
    rating: 0,
    comment: ''
  };
  ratedFilms: UserRating[] = [];
  hoverRating: number = 0;

  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    this.loadFilms();
    this.loadRatedFilms();
    
    // Vérifier si un filmId est passé en paramètre
    this.route.params.subscribe(params => {
      if (params['filmId']) {
        const filmId = parseInt(params['filmId']);
        const film = this.films.find(f => f.id === filmId);
        if (film) {
          this.selectFilm(film);
        }
      }
    });
  }

  loadFilms() {
    this.films = [
      {
        id: 1,
        title: 'The Shawshank Redemption',
        genre: 'Drama',
        releaseDate: '1994',
        poster: 'https://via.placeholder.com/150x225?text=Shawshank'
      },
      {
        id: 2,
        title: 'The Godfather',
        genre: 'Crime, Drama',
        releaseDate: '1972',
        poster: 'https://via.placeholder.com/150x225?text=Godfather'
      },
      {
        id: 3,
        title: 'The Dark Knight',
        genre: 'Action, Crime, Drama',
        releaseDate: '2008',
        poster: 'https://via.placeholder.com/150x225?text=DarkKnight'
      },
      {
        id: 4,
        title: 'Pulp Fiction',
        genre: 'Crime, Drama',
        releaseDate: '1994',
        poster: 'https://via.placeholder.com/150x225?text=PulpFiction'
      },
      {
        id: 5,
        title: 'Forrest Gump',
        genre: 'Drama, Romance',
        releaseDate: '1994',
        poster: 'https://via.placeholder.com/150x225?text=ForrestGump'
      },
      {
        id: 6,
        title: 'Inception',
        genre: 'Action, Sci-Fi, Thriller',
        releaseDate: '2010',
        poster: 'https://via.placeholder.com/150x225?text=Inception'
      }
    ];
  }

  loadRatedFilms() {
    // Données fictives des films notés
    this.ratedFilms = [
      { filmId: 1, rating: 9, comment: 'Un chef-d\'œuvre absolu' },
      { filmId: 3, rating: 8, comment: 'Très bon film d\'action' }
    ];
  }

  selectFilm(film: Film) {
    this.selectedFilm = film;
    this.userRating = {
      filmId: film.id,
      rating: 0,
      comment: ''
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
    if (this.userRating.rating === 0) {
      alert('Veuillez sélectionner une note');
      return;
    }

    // Vérifier si le film a déjà été noté
    const existingIndex = this.ratedFilms.findIndex(r => r.filmId === this.userRating.filmId);
    if (existingIndex >= 0) {
      this.ratedFilms[existingIndex] = { ...this.userRating };
    } else {
      this.ratedFilms.push({ ...this.userRating });
    }

    alert('Film noté avec succès!');
    this.resetForm();
  }

  resetForm() {
    this.selectedFilm = null;
    this.userRating = {
      filmId: 0,
      rating: 0,
      comment: ''
    };
    this.hoverRating = 0;
  }

  getRatingForFilm(filmId: number): UserRating | undefined {
    return this.ratedFilms.find(r => r.filmId === filmId);
  }

  deleteRating(filmId: number) {
    this.ratedFilms = this.ratedFilms.filter(r => r.filmId !== filmId);
  }

  getFilmTitle(filmId: number): string {
    const film = this.films.find(f => f.id === filmId);
    return film ? film.title : 'Film inconnu';
  }
}

