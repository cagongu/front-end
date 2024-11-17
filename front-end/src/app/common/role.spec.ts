import { Permission } from './permission'; 

export class Role {
  name: string;
  description: string;
  permissions: Permission[];

  constructor(name: string, description: string, permissions: Permission[]) {
    this.name = name;
    this.description = description;
    this.permissions = permissions;
  }
}
