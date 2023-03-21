import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, shareReplay } from 'rxjs';
import { apiBaseUrl } from 'src/config';

import { LeosAppConfig, LeosConfig } from '@/shared';

@Injectable({
  providedIn: 'root',
})
export class AppConfigService {
  config = this.http
    .get<LeosConfig>(`${apiBaseUrl}/secured/config`)
    .pipe(map(createLeosAppConfig))
    .pipe(shareReplay(1));

  constructor(private http: HttpClient) {}
}

const createLeosAppConfig = (config: LeosConfig): LeosAppConfig => ({
  ...processConfig(config),
  leosBuildDate: process.env.NG_APP_LEOS_VERSION_BUILD_DATE,
  leosBuildTimestamp: process.env.NG_APP_LEOS_BUILD_TIMESTAMP,
  leosBuildVersion: process.env.NG_APP_LEOS_VERSION,
  leosSourceRevision: process.env.NG_APP_LEOS_SOURCE_REVISION,
});

/** FIXME: Process config server response, injecting missing props. */
const processConfig = (config: LeosConfig) => {
  const newConfig = { ...config };
  const logError = (key: string, expected: string, value: string) =>
    console.error(
      `Expected ${key} to be ${expected}, but it has the value of "${value}".` +
        ' Remove code in AppConfigService.processConfig.',
    );
  if (config.user.lang === undefined) {
    newConfig.user = {
      ...config.user,
      lang: null,
    };
  } else {
    logError('config.user.lang', 'undefined', JSON.stringify(config.user.lang)); // FIXME
  }
  if (config.permissionMap === undefined) {
    newConfig.permissionMap = {
      OWNER: [
        'CAN_READ',
        'CAN_UPDATE',
        'CAN_DELETE',
        'CAN_COMMENT',
        'CAN_SUGGEST',
        'CAN_EDIT_ALL_ANNOTATIONS',
        'CAN_MERGE_SUGGESTION',
        'CAN_MARK_TREATED',
        'CAN_EXPORT_LW',
        'CAN_EXPORT_DW',
        'CAN_CREATE_MILESTONE',
        'CAN_RESTORE_PREVIOUS_VERSION',
        'CAN_ADD_REMOVE_COLLABORATOR',
        'CAN_DOWNLOAD_PROPOSAL',
        'CAN_UPLOAD',
        'CAN_WORK_WITH_EXPORT_PACKAGE',
        'CAN_RENUMBER',
        'CAN_TOGGLE_LIVE_DIFFING',
      ],
      CONTRIBUTOR: [
        'CAN_READ',
        'CAN_UPDATE',
        'CAN_SUGGEST',
        'CAN_COMMENT',
        'CAN_MERGE_SUGGESTION',
      ],
      REVIEWER: ['CAN_SUGGEST', 'CAN_READ', 'CAN_COMMENT'],
      SUPPORT: [
        'CAN_READ',
        'CAN_UPDATE',
        'CAN_DELETE',
        'CAN_COMMENT',
        'CAN_SUGGEST',
        'CAN_MERGE_SUGGESTION',
        'CAN_MARK_TREATED',
        'CAN_EXPORT_LW',
        'CAN_EXPORT_DW',
        'CAN_CREATE_MILESTONE',
        'CAN_RESTORE_PREVIOUS_VERSION',
        'CAN_ADD_REMOVE_COLLABORATOR',
        'CAN_DOWNLOAD_PROPOSAL',
        'CAN_DOWNLOAD_XML_COMPARISON',
        'CAN_UPLOAD',
        'CAN_SEE_SOURCE',
        'CAN_SEE_ALL_DOCUMENTS',
        'CAN_WORK_WITH_EXPORT_PACKAGE',
        'CAN_CLOSE_PROPOSAL',
      ],
      ADMIN: [
        'CAN_READ',
        'CAN_UPDATE',
        'CAN_DELETE',
        'CAN_COMMENT',
        'CAN_SUGGEST',
        'CAN_EDIT_ALL_ANNOTATIONS',
        'CAN_MERGE_SUGGESTION',
        'CAN_MARK_TREATED',
        'CAN_EXPORT_LW',
        'CAN_EXPORT_DW',
        'CAN_CREATE_MILESTONE',
        'CAN_RESTORE_PREVIOUS_VERSION',
        'CAN_ADD_REMOVE_COLLABORATOR',
        'CAN_DOWNLOAD_PROPOSAL',
        'CAN_DOWNLOAD_XML_COMPARISON',
        'CAN_UPLOAD',
        'CAN_SEE_ALL_DOCUMENTS',
        'CAN_WORK_WITH_EXPORT_PACKAGE',
        'CAN_CLOSE_PROPOSAL',
      ],
      USER: [],
    };
  } else {
    logError(
      'config.permissionMap',
      'undefined',
      JSON.stringify(config.permissionMap),
    ); // FIXME
  }

  return newConfig;
};
