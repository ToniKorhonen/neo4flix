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
  reason: string;
  poster?: string;
}

@Component({
  selector: 'app-recommendations',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './recommendations.component.html',
  styleUrls: ['./recommendations.component.scss']
})
export class RecommendationsComponent implements OnInit {
  recommendations: Film[] = [];
  filteredRecommendations: Film[] = [];
  selectedGenre: string = '';
  genres: string[] = [];

  ngOnInit() {
    this.loadRecommendations();
    this.extractGenres();
  }

  loadRecommendations() {
    // Données fictives pour les recommandations
    this.recommendations = [
      {
        id: 7,
        title: 'The Matrix',
        releaseDate: '1999',
        genre: 'Action, Sci-Fi',
        rating: 8.7,
        reason: 'Vous avez aimé "Inception", vous aimerez ce film de science-fiction',
        poster: 'https://via.placeholder.com/300x450?text=Matrix'
      },
      {
        id: 8,
        title: 'Interstellar',
        releaseDate: '2014',
        genre: 'Adventure, Drama, Sci-Fi',
        rating: 8.6,
        reason: 'Basé sur vos notes élevées pour les dramas de science-fiction',
        poster: 'https://via.placeholder.com/300x450?text=Interstellar'
      },
      {
        id: 9,
        title: 'The Departed',
        releaseDate: '2006',
        genre: 'Crime, Drama, Thriller',
        rating: 8.5,
        reason: 'Similaire aux films de crime que vous avez appréciés',
        poster: 'https://via.placeholder.com/300x450?text=TheDeparted'
      },
      {
        id: 10,
        title: 'Fight Club',
        releaseDate: '1999',
        genre: 'Drama, Thriller',
        rating: 8.8,
        reason: 'Film dramatique avec une note élevée correspondant à vos goûts',
        poster: 'https://via.placeholder.com/300x450?text=FightClub'
      },
      {
        id: 11,
        title: 'The Social Network',
        releaseDate: '2010',
        genre: 'Biography, Drama',
        rating: 7.7,
        reason: 'Drame contemporain adapté à votre profil',
        poster: 'https://via.placeholder.com/300x450?text=SocialNetwork'
      },
      {
        id: 12,
        title: 'Gladiator',
        releaseDate: '2000',
        genre: 'Action, Adventure, Drama',
        rating: 8.5,
        reason: 'Film d\'action de haut niveau basé sur votre historique',
        poster: 'https://via.placeholder.com/300x450?text=Gladiator'
      }
    ];

    this.filteredRecommendations = [...this.recommendations];
  }

  extractGenres() {
    const genreSet = new Set<string>();
    this.recommendations.forEach(film => {
      film.genre.split(',').forEach(g => {
        genreSet.add(g.trim());
      });
    });
    this.genres = Array.from(genreSet).sort();
  }

  filterByGenre() {
    if (!this.selectedGenre) {
      this.filteredRecommendations = [...this.recommendations];
    } else {
      this.filteredRecommendations = this.recommendations.filter(film =>
        film.genre.toLowerCase().includes(this.selectedGenre.toLowerCase())
      );
    }
  }

  sortByRating() {
    this.filteredRecommendations.sort((a, b) => b.rating - a.rating);
  }

  sortByNewest() {
    this.filteredRecommendations.sort((a, b) => {
      return parseInt(b.releaseDate) - parseInt(a.releaseDate);
    });
  }

  resetFilters() {
    this.selectedGenre = '';
    this.filteredRecommendations = [...this.recommendations];
  }
}

