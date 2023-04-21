import { ApplicationRole } from '@/shared';

export interface User {
  login: string;
  firstName: string;
  lastName: string;
  entities: UserEntity[];
  email: string;
  roles: ApplicationRole[];
  id: number;
  name: string;
  connectedEntity: UserEntity | null;
  defaultEntity: UserEntity | null;
  lang: string;
}

export interface UserEntity {
  id: string;
  name: string;
  organizationName: string;
}
