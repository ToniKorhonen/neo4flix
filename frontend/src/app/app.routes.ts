import { Routes } from '@angular/router';
import { authGuard } from '@shared/guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'auth',
    pathMatch: 'full'
  },
  {
    path: 'auth',
    loadComponent: () => import('./auth/auth.component').then(m => m.AuthComponent)
  },
  {
    path: 'films',
    loadComponent: () => import('./films/films.component').then(m => m.FilmsComponent),
    canActivate: [authGuard]
  },
  {
    path: 'films/:id',
    loadComponent: () => import('./films/film-detail/film-detail.component').then(m => m.FilmDetailComponent),
    canActivate: [authGuard]
  },
  {
    path: 'users',
    loadComponent: () => import('./users/users.component').then(m => m.UsersComponent),
    canActivate: [authGuard]
  },
  {
    path: 'ratings',
    loadComponent: () => import('./ratings/ratings.component').then(m => m.RatingsComponent),
    canActivate: [authGuard]
  },
  {
    path: 'ratings/:filmId',
    loadComponent: () => import('./ratings/ratings.component').then(m => m.RatingsComponent),
    canActivate: [authGuard]
  },
  {
    path: 'recommendations',
    loadComponent: () => import('./recommendations/recommendations.component').then(m => m.RecommendationsComponent),
    canActivate: [authGuard]
  }
];

