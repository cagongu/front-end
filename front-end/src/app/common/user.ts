import { Role } from './role';

export class User {
  id: string;
  username: string;
  roles: Role[];

  constructor(id: string, username: string, roles: Role[]) {
    this.id = id;
    this.username = username;
    this.roles = roles;
  }
}
