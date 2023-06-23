import {
  Component,
  EventEmitter,
  OnDestroy,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { EuiDialogComponent } from '@eui/components/eui-dialog/eui-dialog.component';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-milestone-annotation-warning-modal',
  templateUrl: './milestone-annotation-warning-modal.component.html',
  styleUrls: ['./milestone-annotation-warning-modal.component.scss'],
})
export class MilestoneAnnotationWarningModalComponent
  implements OnInit, OnDestroy
{
  @Output() closed = new EventEmitter();
  @Output() modalAccepted = new EventEmitter();
  destroy$ = new Subject<any>();
  @ViewChild('milestoneAnnotationWarningModal')
  milestoneAnnotationWarningModal: EuiDialogComponent;
  constructor() {}

  ngOnInit(): void {}

  ngOnDestroy() {
    this.destroy$.next(null);
    this.destroy$.complete();
  }

  open() {
    this.milestoneAnnotationWarningModal.openDialog();
  }

  close() {
    console.log('close');
    this.milestoneAnnotationWarningModal.closeDialog();
    this.closed.emit();
  }

  onAccept() {
    this.modalAccepted.emit();
    this.close();
  }
}
