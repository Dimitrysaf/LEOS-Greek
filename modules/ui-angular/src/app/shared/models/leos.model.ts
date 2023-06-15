import { Permission, Role, User } from '@/shared';

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
  spellCheckerSourceUrl: string | null;
  searchAndReplaceEnabled: boolean;
  sendForRevisionEnabled: boolean;
  coverPageSeparated: boolean;
  supportDocumentEnabled: boolean;
  supportDocumentCatalogKey: string | null;
  permissionsMap: Record<Role, Permission[]>;
  user: User;
  annotateAuthority: string;
  annotateClientUrl: string;
  annotateHostUrl: string;
  annotateJwtIssuerClientId: string;
  annotatePopupDefaultStatus: 'ON' | 'OFF';
};

export type LeosAppConfig = LeosConfig & {
  userAppPermissions: Permission[];
  leosBuildDate: string;
  leosBuildTimestamp: string;
  leosBuildVersion: string;
  leosSourceRevision: string;
};
