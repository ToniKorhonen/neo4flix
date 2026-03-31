import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@environments/environment';

export interface AuthResponse {
  token: string;
  username: string;
  email: string;
  message: string;
}

export interface RegisterRequest {
  email: string;
  username: string;
  password: string;
}

export interface LoginRequest {
  emailOrUsername: string;
  password: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = `${environment.apiUrl}/auth`;

  constructor(private http: HttpClient) { }

  login(request: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, request);
  }

  register(request: RegisterRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/register`, request);
  }

  logout(): void {
    localStorage.removeItem(environment.jwtTokenKey);
  }

  getToken(): string | null {
    return localStorage.getItem(environment.jwtTokenKey);
  }

  setToken(token: string): void {
    localStorage.setItem(environment.jwtTokenKey, token);
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  refreshToken(): Observable<{ token: string }> {
    return this.http.post<{ token: string }>(`${this.apiUrl}/refresh`, {});
  }
}

