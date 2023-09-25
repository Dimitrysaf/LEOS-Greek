import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { EuiDialogComponent } from '@eui/components/eui-dialog';
import { Subject, takeUntil } from 'rxjs';

import { ProposalDetailsService } from '@/features/proposal-view/services/proposal-details.service';
import { Permission } from '@/shared';
import { noWhitespaceValidator } from '@/shared/utils/validators';

@Component({
  selector: 'app-edit-title-dialog',
  templateUrl: './edit-title-dialog.component.html',
  styleUrls: ['./edit-title-dialog.component.scss'],
})
export class EditTitleDialogComponent implements OnInit, OnDestroy {
  @Input() nonEditablePartOfTitle: string;
  @Input() editableTitle: string;
  @Input() isClonedProposal: boolean;
  @Input() originRef: string | null;

  createForm: FormGroup;
  @Input() permissions: Permission[];
  @ViewChild('editTitleDialog') dialog: EuiDialogComponent;

  private destroy$: Subject<any> = new Subject();

  constructor(
    private fb: FormBuilder,
    private proposalDetailsService: ProposalDetailsService,
  ) {}

  ngOnInit(): void {
    this.createForm = this.fb.group({
      docPurpose: new FormControl(this.editableTitle, {
        validators: [Validators.required, noWhitespaceValidator],
      }),
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next(null);
    this.destroy$.unsubscribe();
  }

  openDialog() {
    this.dialog.openDialog();
  }

  closeDialog() {
    this.dialog.closeDialog();
  }

  isFormValid(): boolean {
    return this.createForm.valid;
  }

  handleSave() {
    this.dialog.closeDialog();
    const newTitle = this.createForm.get('docPurpose').value.trim();
    this.proposalDetailsService.updateProposalMetadata(newTitle, null);
  }
}
