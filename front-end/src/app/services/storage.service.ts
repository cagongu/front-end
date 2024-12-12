import { Injectable } from '@angular/core';
import { UserService } from './user.service';
import { User } from '../common/user';

const USER_KEY = 'auth-user';
const TOKEN_KEY = 'auth-token';

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  constructor(private userService: UserService) { }
  user: User | undefined;
  isLoggedIn: boolean = false;

  clean(): void {
    window.localStorage.clear();
    this.isLoggedIn = false; 
  }

  public saveUser(): void {
    this.userService.getInfor().subscribe({
      next: (result) => {
        this.user = result;

        this.isLoggedIn = true;
        window.sessionStorage.setItem('isLoggedIn', JSON.stringify(this.isLoggedIn));

        window.sessionStorage.removeItem(USER_KEY);
        window.sessionStorage.setItem(USER_KEY, JSON.stringify(this.user));
      },
      error: (err) => {
        console.error('Get infor that bai!!', err);
      }
    })
  }

  public getUser(): User | null {
    const userData = window.sessionStorage.getItem(USER_KEY);
    if (userData) {
      try {
        return JSON.parse(userData) as User;
      } catch (error) {
        console.error("Failed to parse user data from session storage", error);
        return null;
      }
    }
    return null;
  }

  public saveToken(token: string): void {
    window.sessionStorage.removeItem(TOKEN_KEY);
    window.sessionStorage.setItem(TOKEN_KEY, token);
  }

  public getToken(): string | null {
    return window.sessionStorage.getItem(TOKEN_KEY);
  }
}
