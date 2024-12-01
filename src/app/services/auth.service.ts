import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { User, LoginAttempt } from '../models/user.model';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly LOCK_TIME = 300000; // 5 minutes in milliseconds
  private readonly MAX_ATTEMPTS = 3;
  private readonly ATTEMPT_WINDOW = 300000; // 5 minutes in milliseconds

  private currentUserSubject: BehaviorSubject<User | null>;

  constructor(private storageService: StorageService) {
    this.currentUserSubject = new BehaviorSubject<User | null>(this.storageService.getCurrentUser());
    console.log('AuthService initialized with user:', this.currentUserSubject.value);
  }

  get currentUser$(): Observable<User | null> {
    return this.currentUserSubject.asObservable();
  }

  get currentUser(): User | null {
    return this.currentUserSubject.value;
  }

  private isAccountLocked(username: string): boolean {
    const attempts = this.storageService.getLoginAttempts();
    const userAttempts = attempts.get(username) || [];
    
    if (userAttempts.length === 0) return false;

    const lastAttempt = userAttempts[userAttempts.length - 1];
    const timeSinceLastAttempt = Date.now() - lastAttempt.timestamp;

    if (timeSinceLastAttempt < this.LOCK_TIME) {
      const recentFailedAttempts = userAttempts.filter(
        attempt => !attempt.success && 
        (Date.now() - attempt.timestamp) < this.ATTEMPT_WINDOW
      );

      return recentFailedAttempts.length >= this.MAX_ATTEMPTS;
    }

    return false;
  }

  private recordLoginAttempt(username: string, success: boolean) {
    const attempts = this.storageService.getLoginAttempts();
    const userAttempts = attempts.get(username) || [];
    userAttempts.push({ timestamp: Date.now(), success });
    attempts.set(username, userAttempts);
    this.storageService.setLoginAttempts(attempts);
    console.log(`Login attempt recorded for ${username}:`, { success });
  }

  login(username: string, password: string): { success: boolean; message: string } {
    console.log('Attempting login for user:', username);
    
    if (this.isAccountLocked(username)) {
      console.log('Account is locked:', username);
      return {
        success: false,
        message: 'Account is temporarily locked. Please try again later.'
      };
    }

    const users = this.storageService.getUsers();
    console.log('Available users:', users);
    
    const user = users.find(u => u.username === username);
    console.log('Found user:', user);
    
    if (user && user.password === password) {
      console.log('Login successful for:', username);
      this.recordLoginAttempt(username, true);
      this.currentUserSubject.next(user);
      this.storageService.setCurrentUser(user);
      return { success: true, message: 'Login successful' };
    } else {
      console.log('Login failed for:', username);
      this.recordLoginAttempt(username, false);
      return { success: false, message: 'Invalid username or password' };
    }
  }

  logout() {
    console.log('Logging out current user');
    this.currentUserSubject.next(null);
    this.storageService.setCurrentUser(null);
  }

  resetStorage() {
    console.log('Resetting storage');
    this.storageService.clearAllData();
    this.currentUserSubject.next(null);
  }
}