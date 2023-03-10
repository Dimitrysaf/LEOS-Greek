//to get the default entity --> connectedEntity
import { ApplicationRole } from '@/shared';

export interface User {
  login: string;
  firstName: string;
  lastName: string;
  entities: UserEntity[];
  email: string;
  roles: string[];
  id: number;
  name: string;
  connectedEntity: UserEntity;
  defaultEntity: UserEntity;
}
export interface UserEntity {
  id: string;
  name: string;
  organisationName: string;
}
