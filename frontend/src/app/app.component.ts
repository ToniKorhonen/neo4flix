import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink, RouterLinkActive, Router, NavigationEnd } from '@angular/router';
import { AuthService } from './shared/services/auth.service';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'Neo4flix';
  isLoggedIn = false;
  showHeader = false;
  private authSubscription!: Subscription;
  private routerSubscription!: Subscription;

  constructor(private router: Router, private authService: AuthService) {}

  ngOnInit() {
    // Vérifier si l'utilisateur est connecté au chargement
    this.checkLoginStatus();
    // S'abonner aux changements d'authentification
    this.authSubscription = this.authService.authStatus$.subscribe(status => {
      this.isLoggedIn = status;
      // Update header visibility when auth status changes
      this.updateHeaderVisibility();
    });
    
    // S'abonner aux changements de route
    this.routerSubscription = this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        this.updateHeaderVisibility();
      });
  }

  ngOnDestroy() {
    if (this.authSubscription) {
      this.authSubscription.unsubscribe();
    }
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }
  }

  checkLoginStatus() {
    this.isLoggedIn = this.authService.isAuthenticated();
    this.updateHeaderVisibility();
  }

  updateHeaderVisibility() {
    // Show header only if logged in AND not on /auth route
    const currentUrl = this.router.url;
    this.showHeader = this.isLoggedIn && !currentUrl.includes('/auth');
  }

  logout() {
    this.authService.logout();
    this.isLoggedIn = false;
    this.showHeader = false;
    this.router.navigate(['/auth']);
  }
}


