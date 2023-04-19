import { Pipe, PipeTransform } from '@angular/core';

import { unescapeHtml } from '@/shared/utils/string.utils';

@Pipe({
  name: 'unescapeHtml',
})
export class UnescapeHtmlPipe implements PipeTransform {
  /**
   * Unescapes a string containing HTML.
   */
  transform(value: unknown): string {
    if (typeof value !== 'string') {
      throw new Error(`The input value to the pipe must be a string`);
    }
    return unescapeHtml(value);
  }
}
