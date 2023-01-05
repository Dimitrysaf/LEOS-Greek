declare const process: {
  env: {
    NG_APP_ENV: string;
    NG_APP_LEOS_INSTANCE: string;
    NG_APP_LEOS_ENV: string;
    // Replace the line below with your environment variable for better type checking
    [key: string]: any;
  };
};
