import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { EuiDialogComponent } from '@eui/components/eui-dialog';

import { CoEditionVO } from '@/shared/models/coEditionVO.model';
import { CoEditionServiceWS } from '@/shared/services/coEdition.websocket.service';

@Component({
  selector: 'app-co-edition-detected-dialog',
  templateUrl: './co-edition-detected-dialog.component.html',
  styleUrls: ['./co-edition-detected-dialog.component.scss'],
})
export class CoEditionDetectedDialogComponent implements OnInit, OnChanges {
  @ViewChild('coEditionDetectedDialog')
  coEditionDetectedDialog: EuiDialogComponent;
  coEditionsVO: { [key: string]: CoEditionVO[] };
  constructor(private coEditionService: CoEditionServiceWS) {
    this.coEditionService.getDocCoEditionInfo().subscribe((c: any) => {
      this.coEditionsVO = c;
    });
  }

  ngOnChanges(changes: SimpleChanges): void {}

  handleContinue() {
    this.coEditionDetectedDialog.accept.emit();
    this.coEditionDetectedDialog.closeDialog();
  }
  handleCancel() {
    this.coEditionDetectedDialog.dismiss.emit();
    this.coEditionDetectedDialog.closeDialog();
  }

  ngOnInit(): void {}
}
