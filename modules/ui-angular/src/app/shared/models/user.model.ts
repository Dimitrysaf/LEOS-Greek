//to get the default entity --> connectedEntity
import { ApplicationRole } from '@/shared';

export interface User {
  id: string;
  login?: string;
  name?: string;
  entities?: Entity[];
  email?: string;
  roles?: ApplicationRole[];
  connectedEntity?: Entity;
}

export interface Entity {
  id: string;
  name: string;
  organisationName: string;
}
