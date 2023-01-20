//to get the default entity --> connectedEntity
import { ApplicationRole } from '@/shared';

export interface User {
  id: string;
  login?: string;
  name?: string;
  entities?: UserEntity[];
  email?: string;
  roles?: ApplicationRole[];
  connectedEntity?: UserEntity;
}

export interface UserEntity {
  id: string;
  name: string;
  organisationName: string;
}
