export interface DownloadPreviewResponse {
  status: 'READY' | 'GENERATING' | 'STALE' | 'NONE';
  message?: string;
  previewBlob?: string;
  previewVersion?: string;
  currentVersion?: string;
  messageKey?: string;
}

export interface StalePreviewInfo {
  isStale: boolean;
  previewVersion: string;
  currentVersion: string;
  messageKey: string;
}