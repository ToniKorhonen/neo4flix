import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService, RegisterRequest, LoginRequest } from '@shared/services/auth.service';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss']
})
export class AuthComponent {
  isLogin = true; // Toggle entre login et register
  isLoading = false;
  errorMessage = '';
  successMessage = '';

  loginForm!: FormGroup;
  registerForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.initializeForms();
  }

  initializeForms(): void {
    this.loginForm = this.fb.group({
      emailOrUsername: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });

    this.registerForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      username: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(20)]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  toggleAuthMode(): void {
    this.isLogin = !this.isLogin;
    this.errorMessage = '';
    this.successMessage = '';
  }

  onLogin(): void {
    if (this.loginForm.invalid) {
      this.errorMessage = 'Please fill all fields correctly';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    const loginRequest: LoginRequest = {
      emailOrUsername: this.loginForm.get('emailOrUsername')?.value,
      password: this.loginForm.get('password')?.value
    };

    this.authService.login(loginRequest).subscribe({
      next: (response) => {
        if (response.token) {
          this.authService.setToken(response.token);
          this.successMessage = 'Login successful! Redirecting...';
          setTimeout(() => {
            this.router.navigate(['/films']);
          }, 1000);
        } else {
          this.errorMessage = response.message || 'Login failed';
        }
        this.isLoading = false;
      },
      error: (error) => {
        this.errorMessage = error.error?.message || 'Login failed. Please try again.';
        this.isLoading = false;
      }
    });
  }

  onRegister(): void {
    if (this.registerForm.invalid) {
      this.errorMessage = 'Please fill all fields correctly';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    const registerRequest: RegisterRequest = {
      email: this.registerForm.get('email')?.value,
      username: this.registerForm.get('username')?.value,
      password: this.registerForm.get('password')?.value
    };

    this.authService.register(registerRequest).subscribe({
      next: (response) => {
        if (response.token) {
          this.authService.setToken(response.token);
          this.successMessage = 'Registration successful! Redirecting...';
          setTimeout(() => {
            this.router.navigate(['/films']);
          }, 1000);
        } else {
          this.errorMessage = response.message || 'Registration failed';
        }
        this.isLoading = false;
      },
      error: (error) => {
        this.errorMessage = error.error?.message || 'Registration failed. Please try again.';
        this.isLoading = false;
      }
    });
  }
}

