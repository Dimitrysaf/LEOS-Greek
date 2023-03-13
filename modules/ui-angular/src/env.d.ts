declare namespace NodeJS {
  export interface ProcessEnv {
    /* = NODE_ENV */
    NG_APP_ENV: string;
    NG_APP_LEOS_INSTANCE: string;
    NG_APP_LEOS_SOURCE_REVISION: string;
    NG_APP_LEOS_VERSION: string;
    NG_APP_LEOS_VERSION_BUILD_DATE: string;
    NG_APP_LEOS_BUILD_TIMESTAMP: string;
    NG_APP_REFRESH_TOKEN: string;
  }
}

declare const process: {
  env: NodeJS.ProcessEnv;
};
