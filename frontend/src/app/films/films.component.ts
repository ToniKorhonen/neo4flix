import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

interface Film {
  id: number;
  title: string;
  releaseDate: string;
  genre: string;
  rating: number;
  poster?: string;
}

@Component({
  selector: 'app-films',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './films.component.html',
  styleUrls: ['./films.component.scss']
})
export class FilmsComponent implements OnInit {
  // ...existing code...
  films: Film[] = [];
  filteredFilms: Film[] = [];
  searchQuery: string = '';

  ngOnInit() {
    this.loadFilms();
  }

  loadFilms() {
    // Données fictives pour l'instant
    this.films = [
      {
        id: 1,
        title: 'The Shawshank Redemption',
        releaseDate: '1994',
        genre: 'Drama',
        rating: 9.3,
        poster: 'https://via.placeholder.com/300x450?text=Shawshank'
      },
      {
        id: 2,
        title: 'The Godfather',
        releaseDate: '1972',
        genre: 'Crime, Drama',
        rating: 9.2,
        poster: 'https://via.placeholder.com/300x450?text=Godfather'
      },
      {
        id: 3,
        title: 'The Dark Knight',
        releaseDate: '2008',
        genre: 'Action, Crime, Drama',
        rating: 9.0,
        poster: 'https://via.placeholder.com/300x450?text=DarkKnight'
      },
      {
        id: 4,
        title: 'Pulp Fiction',
        releaseDate: '1994',
        genre: 'Crime, Drama',
        rating: 8.9,
        poster: 'https://via.placeholder.com/300x450?text=PulpFiction'
      },
      {
        id: 5,
        title: 'Forrest Gump',
        releaseDate: '1994',
        genre: 'Drama, Romance',
        rating: 8.8,
        poster: 'https://via.placeholder.com/300x450?text=ForrestGump'
      },
      {
        id: 6,
        title: 'Inception',
        releaseDate: '2010',
        genre: 'Action, Sci-Fi, Thriller',
        rating: 8.8,
        poster: 'https://via.placeholder.com/300x450?text=Inception'
      }
    ];
    this.filteredFilms = [...this.films];
  }

  searchFilms() {
    const query = this.searchQuery.toLowerCase();
    if (!query) {
      this.filteredFilms = [...this.films];
    } else {
      this.filteredFilms = this.films.filter(film =>
        film.title.toLowerCase().includes(query) ||
        film.genre.toLowerCase().includes(query)
      );
    }
  }
}

