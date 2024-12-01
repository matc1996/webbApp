import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="login-container">
      <div class="login-box">
        <h2>Login</h2>
        
        <form (ngSubmit)="onSubmit()" #loginForm="ngForm">
          <div class="form-group">
            <label for="username">Username:</label>
            <input
              type="text"
              id="username"
              name="username"
              [(ngModel)]="username"
              required
            />
          </div>
          <div class="form-group">
            <label for="password">Password:</label>
            <input
              type="password"
              id="password"
              name="password"
              [(ngModel)]="password"
              required
            />
          </div>
          <button type="submit" [disabled]="!loginForm.form.valid">Login</button>
          <button type="button" (click)="resetStorage()" class="reset-button">Resetear usuarios</button>
          <div *ngIf="errorMessage" class="error-message">
            {{ errorMessage }}
          </div>
        </form>
      </div>
    </div>
  `,
  styles: [`
    .login-container {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 100vh;
      background-color: #f5f5f5;
    }
    .login-box {
      background: white;
      padding: 2rem;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      width: 100%;
      max-width: 400px;
    }
    .credentials-info {
      margin-bottom: 1.5rem;
      padding: 1rem;
      background-color: #f8f9fa;
      border-radius: 4px;
    }
    .credentials-info ul {
      list-style-type: none;
      padding-left: 0;
      margin-top: 0.5rem;
    }
    .credentials-info li {
      margin-bottom: 0.25rem;
      font-family: monospace;
    }
    .form-group {
      margin-bottom: 1rem;
    }
    label {
      display: block;
      margin-bottom: 0.5rem;
    }
    input {
      width: 100%;
      padding: 0.5rem;
      border: 1px solid #ddd;
      border-radius: 4px;
    }
    button {
      width: 100%;
      padding: 0.75rem;
      background-color: #007bff;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      margin-bottom: 0.5rem;
    }
    button:disabled {
      background-color: #cccccc;
    }
    .reset-button {
      background-color: #dc3545;
    }
    .error-message {
      color: red;
      margin-top: 1rem;
      text-align: center;
    }
  `]
})
export class LoginComponent implements OnInit {
  username: string = '';
  password: string = '';
  errorMessage: string = '';

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    // Si hay un usuario actual, redirigir a home
    if (this.authService.currentUser) {
      this.router.navigate(['/home']);
    }
  }

  onSubmit() {
    console.log('Login attempt:', { username: this.username, password: this.password });
    const result = this.authService.login(this.username, this.password);
    
    if (result.success) {
      this.router.navigate(['/home']);
    } else {
      this.errorMessage = result.message;
    }
  }

  resetStorage() {
    this.authService.resetStorage();
    this.errorMessage = 'Usuarios restaurados';
  }
}