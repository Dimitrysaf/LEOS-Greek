import { Permission, Role, User } from '@/shared';

/** @see modules/domain/src/main/java/eu/europa/ec/leos/domain/common/InstanceType.java */
export enum InstanceType {
  COUNCIL = 'cn',
  COMMISSION = 'ec',
  OS = 'os',
  ANY = 'any',
}

/** @see modules/domain/src/main/java/eu/europa/ec/leos/model/action/ContributionVO.java */
export enum ContributionStatus {
  Received = 'RECEIVED',
  ContributionDone = 'CONTRIBUTION_DONE',
}

export const DOCUMENT_STYLES = {
  annex: 'annex',
  bill: 'bill',
  coverpage: 'coverpage',
  explanatory: 'explanatory',
  memorandum: 'memorandum',
  'financial-statement': 'stat_financ_legis',
};

export type Profile = {
  name: string
  breadcrumb: boolean
  tocEdition: boolean
  internalReference: boolean
  authorialNote: boolean
  showLoggedUser: boolean
  trackChangesEnabled: boolean
  closeDocument: boolean
  callbackPresent: boolean
  annotations: boolean
  importOJ: boolean
};

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
  collectionCloseButtonEnabled: boolean;
  showRevisionEnabled: boolean;
  profile?: Profile;
};

export type LeosAppConfig = LeosConfig & {
  userAppPermissions: Permission[];
  leosBuildDate: string;
  leosBuildTimestamp: string;
  leosBuildVersion: string;
  leosSourceRevision: string;
};
