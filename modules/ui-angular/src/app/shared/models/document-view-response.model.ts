import { VersionInfoVO } from './version-info.model';

export interface DocumentViewResponse {
  editableXml: string;
  versionInfoVO: VersionInfoVO;
  proposalRef: string;
}

export interface RefreshElementResponse {
  elementFragment: string;
  elementId: string;
  elementTagName: string;
}
