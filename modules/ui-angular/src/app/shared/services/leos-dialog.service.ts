import { Injectable } from '@angular/core';
import {EuiDialogConfig, EuiDialogService} from "@eui/components/eui-dialog";
import {TranslateService} from "@ngx-translate/core";
import {EuiGrowlService} from "@eui/core";

@Injectable({
  providedIn: 'root'
})
export class LeosDialogService {

  constructor(private dialogService: EuiDialogService,
              private translateService: TranslateService,
              private growlService: EuiGrowlService) { }

  public showMessage(typeClass: 'primary' | 'secondary' | 'info' | 'success' | 'warning' | 'danger' | 'accent',
                     title: string,
                     message: string,
                     messageParams: any = {},
                     clearGrowl: boolean = false) : void {
    const config = new EuiDialogConfig({
      title: this.translateService.instant(title, messageParams),
      content: this.translateService.instant(message, messageParams),
      typeClass: typeClass,
      isMessageBox: true
    });
    if(clearGrowl) {
      this.growlService.clearGrowl();
    }
    this.dialogService.openDialog(config);
  }

  public showSuccess(title: string, message: string, messageParams: any = {},  clearGrowl: boolean = false) : void {
    this.showMessage('success', title, message, messageParams, clearGrowl);
  }

  public showError(title: string, message: string, messageParams: any = {}, clearGrowl: boolean = false) : void {
    this.showMessage('danger', title, message, messageParams, clearGrowl);
  }
}
