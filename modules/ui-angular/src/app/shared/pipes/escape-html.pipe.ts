import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'escapeHtml',
})
export class EscapeHtmlPipe implements PipeTransform {
  transform(value: unknown): string {
    if (value === null || value === undefined) {
      throw new Error(`The input value to the pipe must be defined`);
    }
    return String(value)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }
}
