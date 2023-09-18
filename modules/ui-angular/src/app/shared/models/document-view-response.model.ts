import { VersionInfoVO } from './version-info.model';

export interface DocumentViewResponse {
  editableXml: string;
  versionInfoVO: VersionInfoVO;
  proposalRef: string;
  temporaryAnnotationsId: string;
  temporaryDataDocument: string;
}

export interface RefreshElementResponse {
  elementFragment: string;
  elementId: string;
  elementTagName: string;
}

export interface FetchElementResponse {
  documentRef: string;
  elementFragment: string;
  elementId: string;
  elementTagName: string;
}
