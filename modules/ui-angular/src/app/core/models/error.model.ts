export interface ErrorResponse {
  errorCode: string;
  messageKey: string;
  type: 'ERROR' | 'WARNING';
}
