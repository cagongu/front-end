import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { User } from '../common/user';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  USER_PATH : string = "http://localhost:8888/api/v1/identity/users";

  constructor(private http: HttpClient) { }

  public getInfor(): Observable<Result> {
    const url = this.USER_PATH + '/myInfo';
    return this.http.get<UserResponse>(url).pipe(
      map(response => {
        console.log("get infor thanh cong, " + response);
        return response.result;
      })
    );
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


interface UserResponse {
  code: string;
  result: Result;
}