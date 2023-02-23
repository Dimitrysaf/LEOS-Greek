declare namespace NodeJS {
  export interface ProcessEnv {
    NG_APP_LEOS_INSTANCE: string;
    NG_APP_LEOS_SOURCE_REVISION: string;
    NG_APP_LEOS_VERSION: string;
    NG_APP_LEOS_VERSION_BUILD_DATE: string;
  }
}

declare const process: {
  env: NodeJS.ProcessEnv;
};
