declare namespace NodeJS {
  export interface ProcessEnv {
    NG_APP_ENV: string;
    NG_APP_LEOS_INSTANCE: string;
  }
}

declare const process: {
  env: NodeJS.ProcessEnv;
};
