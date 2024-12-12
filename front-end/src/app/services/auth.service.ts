import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { StorageService } from './storage.service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})

export class AuthService {
 

  AUTH_PATH: string = 'http://localhost:8888/api/v1/identity/auth'
  USER_PATH: string = 'http://localhost:8888/api/v1/identity/users';

  constructor(private http: HttpClient, private storage: StorageService, private router: Router) {
  }

  login(username: string, password: string) {
    this.http.post<LoginResponse>(this.AUTH_PATH + '/token', { username, password }).subscribe({
      next: (response) => {
        console.log(response)
        this.storage.saveToken(response.result.token)
        this.storage.saveUser();
        this.router.navigate(['quan-ly']);
      },
      error: (err) => {
        console.error('Đăng nhập thất bại', err)
      }
    }
    )
  }

  register(username: string,
    password: string,
    firstName: string,
    lastName: string,
    dob: string,
    phoneNumber: string,
    email: string,
    city: string
  ) {
    console.log(username)
    this.http.post<RegisterResponse>(this.USER_PATH + '/registration', {
      username,
      password,
      firstName,
      lastName,
      dob,
      phoneNumber,
      email,
      city
    }).subscribe({
      next: (response) => {
        console.log(response.result);
        this.router.navigate(['dang-nhap']);
      },
      error(err) {
        console.error('Đăng kí thất bại', err);
      },
    })

  }

  logout(): void {
    this.storage.clean(); 
    console.log("Logged out successfully!");
  }
}
interface Permissions{
  name: string;
  description: string;
}
interface Role {
  name: string;
  description: string;
  permissions: Permissions[];
}

interface Result {
  id: string;
  username: string;
  roles: Role[];
}

interface RegisterResponse {
  code: string;
  result: Result;
}


interface LoginResponse {
  code: number;
  result: {
    authenticated: boolean;
    token: string;
  };
}
