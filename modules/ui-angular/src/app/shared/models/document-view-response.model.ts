import { VersionInfoVO } from './version-info.model';

export interface DocumentViewResponse {
  editableXml: string;
  versionInfoVO: VersionInfoVO;
  proposalRef: string;
}
