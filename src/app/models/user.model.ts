export interface User {
  username: string;
  password: string;
  displayName: string;
}

export interface LoginAttempt {
  timestamp: number;
  success: boolean;
}