import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';

interface Film {
  id: number;
  title: string;
  releaseDate: string;
  genre: string;
  rating: number;
  description?: string;
  director?: string;
  cast?: string;
  duration?: number;
  poster?: string;
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

  // Données fictives pour les films
  private filmsData: { [key: number]: Film } = {
    1: {
      id: 1,
      title: 'The Shawshank Redemption',
      releaseDate: '1994',
      genre: 'Drama',
      rating: 9.3,
      director: 'Frank Darabont',
      cast: 'Tim Robbins, Morgan Freeman',
      duration: 142,
      description: 'Two imprisoned men bond over a number of years, finding solace and eventual redemption through acts of common decency.',
      poster: 'https://via.placeholder.com/300x450?text=Shawshank'
    },
    2: {
      id: 2,
      title: 'The Godfather',
      releaseDate: '1972',
      genre: 'Crime, Drama',
      rating: 9.2,
      director: 'Francis Ford Coppola',
      cast: 'Marlon Brando, Al Pacino',
      duration: 175,
      description: 'The aging patriarch of an organized crime dynasty transfers control of his clandestine empire to his reluctant youngest son.',
      poster: 'https://via.placeholder.com/300x450?text=Godfather'
    },
    3: {
      id: 3,
      title: 'The Dark Knight',
      releaseDate: '2008',
      genre: 'Action, Crime, Drama',
      rating: 9.0,
      director: 'Christopher Nolan',
      cast: 'Christian Bale, Heath Ledger',
      duration: 152,
      description: 'When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests.',
      poster: 'https://via.placeholder.com/300x450?text=DarkKnight'
    },
    4: {
      id: 4,
      title: 'Pulp Fiction',
      releaseDate: '1994',
      genre: 'Crime, Drama',
      rating: 8.9,
      director: 'Quentin Tarantino',
      cast: 'John Travolta, Uma Thurman',
      duration: 154,
      description: 'The lives of four mobsters, two hit men, a gangster and his wife intertwine in four tales of violence and redemption.',
      poster: 'https://via.placeholder.com/300x450?text=PulpFiction'
    },
    5: {
      id: 5,
      title: 'Forrest Gump',
      releaseDate: '1994',
      genre: 'Drama, Romance',
      rating: 8.8,
      director: 'Robert Zemeckis',
      cast: 'Tom Hanks, Sally Field',
      duration: 142,
      description: 'The presidencies of Kennedy and Johnson unfold from the perspective of an Alabama man with an IQ of 75.',
      poster: 'https://via.placeholder.com/300x450?text=ForrestGump'
    },
    6: {
      id: 6,
      title: 'Inception',
      releaseDate: '2010',
      genre: 'Action, Sci-Fi, Thriller',
      rating: 8.8,
      director: 'Christopher Nolan',
      cast: 'Leonardo DiCaprio, Marion Cotillard',
      duration: 148,
      description: 'A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea.',
      poster: 'https://via.placeholder.com/300x450?text=Inception'
    }
  };

  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.filmId = params['id'];
      this.loadFilm();
    });
  }

  loadFilm() {
    this.film = this.filmsData[this.filmId] || null;
  }
}

