export type JavaScriptExtensionState = {
  callbackNames: string[];
  rpcInterfaces: Record<string, string[]>;
};

/* defined in `modules/ui/src/main/java/eu/europa/ec/leos/ui/shared/js/LeosJavaScriptExtensionState.java` */
export type LeosJavaScriptExtensionState = JavaScriptExtensionState & {
  jsDepsInited: boolean;
  dirtyTimestamp: number;
};
