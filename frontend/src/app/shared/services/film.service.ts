import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FilmService {
  private apiUrl = `${environment.apiUrl}/films`;

  constructor(private http: HttpClient) { }

  getFilms(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  getFilmById(id: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  // ...existing code...
  createFilm(film: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, film);
  }

  updateFilm(id: string, film: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, film);
  }

  deleteFilm(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  searchFilms(query: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/search`, {
      params: { q: query }
    });
  }
}

