import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'films',
    pathMatch: 'full'
  },
  {
    path: 'auth',
    loadComponent: () => import('./auth/auth.component').then(m => m.AuthComponent)
  },
  {
    path: 'films',
    loadComponent: () => import('./films/films.component').then(m => m.FilmsComponent)
  },
  {
    path: 'users',
    loadComponent: () => import('./users/users.component').then(m => m.UsersComponent)
  },
  {
    path: 'ratings',
    loadComponent: () => import('./ratings/ratings.component').then(m => m.RatingsComponent)
  }
];

