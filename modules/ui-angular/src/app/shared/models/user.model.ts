import { ApplicationRole } from '@/shared';

export interface User {
  login: string;
  firstName: string;
  lastName: string;
  entities: UserEntity[];
  email: string;
  roles: ApplicationRole[];
  userRoles: {role: ApplicationRole, special: boolean}[];
  id: number;
  name: string;
  connectedEntity: UserEntity | null;
  defaultEntity: UserEntity | null;
  lang: string;
  greffeUser: boolean | null;
  dateCreated: Date;
  special: boolean;
}

export interface UserUpdate {
  login: string;
  firstName: string;
  lastName: string;
  email: string;
  roles: ApplicationRole[];
  addedEntities: UserEntity[];
  removedEntities: String[]
}

export interface UserEntity {
  id: string;
  name: string;
  organizationName: string;
  role: string;
}
