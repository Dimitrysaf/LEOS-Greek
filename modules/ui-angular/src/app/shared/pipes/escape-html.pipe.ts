import { Pipe, PipeTransform } from '@angular/core';

import { escapeHtml } from '@/shared/utils/string.utils';

@Pipe({
  name: 'escapeHtml',
})
export class EscapeHtmlPipe implements PipeTransform {
  transform(value: unknown): string {
    if (value === null || value === undefined) {
      throw new Error(`The input value to the pipe must be defined`);
    }
    return escapeHtml(String(value));
  }
}
