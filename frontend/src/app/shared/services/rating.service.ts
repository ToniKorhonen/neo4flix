import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@environments/environment';
@Injectable({
  providedIn: 'root'
})
export class RatingService {
  private apiUrl = `${environment.apiUrl}/ratings`;
  constructor(private http: HttpClient) { }
  rateMovie(userId: number, movieId: number, rating: number): Observable<any> {
    return this.http.post<any>(
      `${this.apiUrl}/user/${userId}/movie/${movieId}`,
      { rating }
    );
  }
  
  deleteRating(userId: number, movieId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/user/${userId}/movie/${movieId}`);
  }
  
  getUserRatings(userId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/user/${userId}`);
  }
  
  getAverageRating(movieId: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/movie/${movieId}/average`);
  }
}
