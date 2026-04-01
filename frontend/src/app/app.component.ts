import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink, RouterLinkActive, Router } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'Neo4flix';
  isLoggedIn = false;

  constructor(private router: Router) {}

  ngOnInit() {
    // Vérifier si l'utilisateur est connecté
    this.checkLoginStatus();
  }

  checkLoginStatus() {
    const token = localStorage.getItem('authToken');
    this.isLoggedIn = !!token;
  }

  logout() {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    this.isLoggedIn = false;
    this.router.navigate(['/auth']);
  }
}


