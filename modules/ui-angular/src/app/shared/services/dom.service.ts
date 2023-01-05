import { DOCUMENT } from '@angular/common';
import { Inject, Injectable } from '@angular/core';

import { createPromise, setDynamicStyle } from '../utils';

@Injectable({
  providedIn: 'root',
})
export class DomService {
  constructor(@Inject(DOCUMENT) private document: Document) {}

  setDynamicStyle(cssURL: string): () => void {
    const style = setDynamicStyle(this.document, cssURL);
    return () => style.remove();
  }

  async loadScript(
    src: string,
    options: Partial<HTMLScriptElement> = {},
    preprocess?: (script: HTMLScriptElement) => void,
  ): Promise<void> {
    const { promise, resolve } = createPromise<void>();

    if (this.document.querySelector(`script[src="${src}"]`)) {
      // already loaded
      resolve();
      return;
    }

    const script = document.createElement('script');
    script.src = src;
    Object.assign(script, options);
    preprocess?.(script);

    script.onload = function (ev) {
      options.onload?.call(this, ev);
      resolve();
    };
    document.head.appendChild(script);

    await promise;
  }
}
