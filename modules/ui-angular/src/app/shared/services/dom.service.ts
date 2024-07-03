import { DOCUMENT } from '@angular/common';
import { Inject, Injectable } from '@angular/core';

import { getCacheBusterArg } from '@/shared/utils/url';

import { createPromise, setDynamicInlineStyle, setDynamicStyle } from '../utils';

@Injectable({
  providedIn: 'root',
})
export class DomService {
  constructor(@Inject(DOCUMENT) private document: Document) {}

  setDynamicStyle(cssURL: string): () => void {
    cssURL += getCacheBusterArg(cssURL);
    const existingStyle = this.document.querySelector(
      `link[href="${cssURL}"]`,
    ) as HTMLLinkElement | null;
    const style = existingStyle ?? setDynamicStyle(this.document, cssURL);
    this.increaseCount(style);

    return () => {
      if (!this.decreaseCount(style)) {
        style.remove();
      }
    };
  }

  setDynamicInlineStyle(cssContent: string, styleId: string): () => void {
    const existingStyle = this.document.querySelector(
      `#${styleId}`,
    ) as HTMLStyleElement | null;
    if (existingStyle) {
      existingStyle.remove();
    }
    const style = setDynamicInlineStyle(this.document, cssContent, styleId);
    this.increaseInlineCount(style);

    return () => {
      if (!this.decreaseInlineCount(style)) {
        style.remove();
      }
    };
  }

  async loadScript(
    src: string,
    options: Partial<HTMLScriptElement> = {},
    preprocess?: (script: HTMLScriptElement) => void,
  ): Promise<void> {
    const { promise, resolve } = createPromise<void>();
    src += getCacheBusterArg(src);

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

  private increaseCount(style: HTMLLinkElement) {
    const oldCount = Number(style.dataset.count) || 0;
    const newCount = oldCount + 1;
    style.dataset.count = String(newCount);
    return newCount;
  }

  private decreaseCount(style: HTMLLinkElement) {
    const oldCount = Number(style.dataset.count) || 1;
    const newCount = oldCount - 1;
    style.dataset.count = String(newCount);
    return newCount;
  }

  private increaseInlineCount(style: HTMLStyleElement) {
    const oldCount = Number(style.dataset.count) || 0;
    const newCount = oldCount + 1;
    style.dataset.count = String(newCount);
    return newCount;
  }

  private decreaseInlineCount(style: HTMLStyleElement) {
    const oldCount = Number(style.dataset.count) || 1;
    const newCount = oldCount - 1;
    style.dataset.count = String(newCount);
    return newCount;
  }
}
