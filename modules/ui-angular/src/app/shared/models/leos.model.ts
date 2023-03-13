import { Permission, User } from '@/shared';

/** @see modules/domain/src/main/java/eu/europa/ec/leos/domain/common/InstanceType.java */
export enum InstanceType {
  COUNCIL = 'cn',
  COMMISSION = 'ec',
  OS = 'os',
  ANY = 'any',
}

export type LeosConfig = {
  headerTitle: string;
  headerPath: string | null;
  mappingUrl: string;
  implicitSaveAndClose: boolean;
  spellCheckerEnabled: boolean;
  spellCheckerServiceUrl: string | null;
  getSpellCheckerSourceUrl: string | null;
  searchAndReplaceEnabled: boolean;
  sendForRevisionEnabled: boolean;
  coverPageSeparated: boolean;
  supportDocumentEnabled: boolean;
  supportDocumentCatalogKey: string | null;
  permissions: Permission[];
  user: User;
};

export type LeosAppConfig = LeosConfig & {
  leosBuildDate: string;
  leosBuildTimestamp: string;
  leosBuildVersion: string;
  leosSourceRevision: string;
};
