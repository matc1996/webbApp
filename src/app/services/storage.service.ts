import { Injectable } from '@angular/core';
import { User, LoginAttempt } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  private readonly USERS_KEY = 'users';
  private readonly LOGIN_ATTEMPTS_KEY = 'loginAttempts';
  private readonly CURRENT_USER_KEY = 'currentUser';

  constructor() {
    this.initializeDefaultUsers();
  }

  private initializeDefaultUsers() {
    if (!this.getUsers().length) {
      const defaultUsers: User[] = [
        { username: 'marcelo', password: 'alumno1', displayName: 'Marcelo' },
        { username: 'alex', password: 'alumno2', displayName: 'Alex' }
      ];
      this.setUsers(defaultUsers);
      console.log('Default users initialized:', defaultUsers);
    }
  }

  getUsers(): User[] {
    const users = localStorage.getItem(this.USERS_KEY);
    const parsedUsers = users ? JSON.parse(users) : [];
    console.log('Retrieved users:', parsedUsers);
    return parsedUsers;
  }

  setUsers(users: User[]): void {
    localStorage.setItem(this.USERS_KEY, JSON.stringify(users));
    console.log('Users saved:', users);
  }

  getLoginAttempts(): Map<string, LoginAttempt[]> {
    const attempts = localStorage.getItem(this.LOGIN_ATTEMPTS_KEY);
    if (!attempts) return new Map();
    
    try {
      const parsed = JSON.parse(attempts);
      return new Map(parsed);
    } catch (e) {
      console.error('Error parsing login attempts:', e);
      return new Map();
    }
  }

  setLoginAttempts(attempts: Map<string, LoginAttempt[]>): void {
    try {
      const serialized = JSON.stringify(Array.from(attempts.entries()));
      localStorage.setItem(this.LOGIN_ATTEMPTS_KEY, serialized);
    } catch (e) {
      console.error('Error saving login attempts:', e);
    }
  }

  getCurrentUser(): User | null {
    const user = localStorage.getItem(this.CURRENT_USER_KEY);
    return user ? JSON.parse(user) : null;
  }

  setCurrentUser(user: User | null): void {
    if (user) {
      localStorage.setItem(this.CURRENT_USER_KEY, JSON.stringify(user));
      console.log('Current user saved:', user);
    } else {
      localStorage.removeItem(this.CURRENT_USER_KEY);
      console.log('Current user cleared');
    }
  }

  clearLoginAttempts(username: string): void {
    const attempts = this.getLoginAttempts();
    attempts.delete(username);
    this.setLoginAttempts(attempts);
    console.log('Login attempts cleared for:', username);
  }

  clearAllData(): void {
    localStorage.removeItem(this.USERS_KEY);
    localStorage.removeItem(this.LOGIN_ATTEMPTS_KEY);
    localStorage.removeItem(this.CURRENT_USER_KEY);
    this.initializeDefaultUsers();
    console.log('All data cleared and reinitialized');
  }
}