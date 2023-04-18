import { Pipe, PipeTransform } from '@angular/core';

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
    return value
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .replace(/&#039;/g, "'")
      .replace(/&amp;/g, '&');
  }
}
