import { RequireConfig } from '@/features/leos-legacy/models/requirejs';

export {};

declare global {
  interface Window {
    LEOS: LEOS;
    LEOS_BOOTSTRAP_CONFIG: RequireConfig;
  }
}

type LEOS = {
  /* defined in `modules/js/src/main/js/leosBootstrap.js` */

  config: Partial<RequireConfig>;

  /* defined in `modules/js/src/main/js/lib/contentScroller.js` */

  scrollTop: (className: string) => void;
  scrollBottom: (className: string) => void;
  scrollTo: (
    element: Element | string,
    target: Element | string,
    additionalAction?: (element: Element) => void,
    blink?: boolean,
  ) => void;
  scrollToElement: (elementId: string, prefix: string) => void;
};
