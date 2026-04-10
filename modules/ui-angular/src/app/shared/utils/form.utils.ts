import {FormGroup} from "@angular/forms";
import {LeosDialogService} from "@/shared/services/leos-dialog.service";

export const validate = (form: FormGroup, dialogConfig?: {
      service: LeosDialogService,
      title: string
      content: string
    }): boolean => {
  form.updateValueAndValidity();
  if (!form.valid) {
    dialogConfig?.service.showError(dialogConfig.title, dialogConfig.content);
    for (const controlKey of Object.keys(form.controls)) {
      const control = form.get(controlKey);
      control?.markAsTouched({onlySelf: true});
    }
  }
  return form.valid;
}
