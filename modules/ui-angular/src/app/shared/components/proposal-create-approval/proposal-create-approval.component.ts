import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-proposal-create-approval',
  templateUrl: './proposal-create-approval.component.html',
  styleUrls: ['./proposal-create-approval.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProposalCreateApprovalComponent {
  @Input() approvalControl: FormControl;
  @Output() approvalChange = new EventEmitter<boolean>();

  onCheckboxChange(event: any) {
    const isChecked = event.target.checked;
    this.approvalControl.setValue(isChecked);
    this.approvalChange.emit(isChecked);
  }
}
