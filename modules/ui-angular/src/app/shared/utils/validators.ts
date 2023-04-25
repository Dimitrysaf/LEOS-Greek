import { FormControl } from '@angular/forms';

export const noWhitespaceValidator = (control: FormControl) =>
  (control.value || '').trim().length ? null : { whitespace: true };
