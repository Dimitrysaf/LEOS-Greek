import {
  Component,
  Inject,
  OnChanges,
  OnInit,
  SimpleChanges,
  ViewChild,
} from '@angular/core';

import { DIALOG_COMPONENT_CONFIG, EuiDialogComponent } from '@eui/components/eui-dialog';
import { CoEditionVO } from '@/shared/models/coEditionVO.model';
import { CoEditionServiceWS } from '@/shared/services/coEdition.websocket.service';

@Component({
  selector: 'app-co-edition-detected-dialog',
  templateUrl: './co-edition-detected-dialog.component.html',
})
export class CoEditionDetectedDialogComponent implements OnInit, OnChanges {

  @ViewChild('coEditionDetectedDialog')
  coEditionDetectedDialog: EuiDialogComponent;
  coEditionsVO: CoEditionVO[];

  constructor(@Inject(DIALOG_COMPONENT_CONFIG) private config, private coEditionService: CoEditionServiceWS) {
  }

  ngOnChanges(changes: SimpleChanges): void {}

  ngOnInit() {
    this.coEditionService.getDocCoEditionInfo()
      .subscribe((coEdits: Record<string, CoEditionVO[]>) => {
        for (const key in coEdits) {
          if (((this.config.coEditionAction === 'EDIT_ELEMENT') && (key !== 'null') && (key === this.config.elementEditedId)) ||
            ((this.config.coEditionAction === 'EDIT_TOC') && (key === 'null'))) {
            this.coEditionsVO = coEdits[key];
            break;
          }
        }
      });
  }

  handleContinue() {
    this.coEditionDetectedDialog.accept.emit();
    this.coEditionDetectedDialog.closeDialog();
  }

  handleCancel() {
    this.coEditionDetectedDialog.dismiss.emit();
    this.coEditionDetectedDialog.closeDialog();
  }

}
