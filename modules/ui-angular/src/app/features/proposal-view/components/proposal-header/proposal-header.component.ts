import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { EuiDialogComponent } from '@eui/components/eui-dialog';
import { Subject, takeUntil } from 'rxjs';

import { Permission } from '@/shared';
import { noWhitespaceValidator } from '@/shared/utils/validators';

import { ProposalDetailsService } from '../../services/proposal-details.service';

@Component({
  selector: 'app-proposal-header',
  templateUrl: './proposal-header.component.html',
  styleUrls: ['./proposal-header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProposalHeaderComponent implements OnInit, OnDestroy {
  @Input() nonEditablePartOfTitle: string;
  @Input() editableTitle: string;
  @Output() saveTitle: EventEmitter<string> = new EventEmitter();
  @ViewChild('editTitle') dialog: EuiDialogComponent;

  title: string;
  createForm: FormGroup;
  permissions: Permission[];

  private destroy$: Subject<void> = new Subject();

  constructor(
    private fb: FormBuilder,
    private proposalDetailsService: ProposalDetailsService,
  ) {}

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  ngOnInit(): void {
    this.title = this.editableTitle;
    this.createForm = this.fb.group({
      docPurpose: new FormControl(this.title, {
        validators: [Validators.required, noWhitespaceValidator],
      }),
    });
    this.proposalDetailsService.permissions$
      .pipe(takeUntil(this.destroy$))
      .subscribe((perms) => (this.permissions = perms));
  }

  handleEdit() {
    this.dialog.openDialog();
  }

  handleSave() {
    this.dialog.closeDialog();
    this.saveTitle.emit(this.createForm.get('docPurpose').value.trim());
  }
  handleClose() {
    this.dialog.closeDialog();
  }

  isFormValid(): boolean {
    return this.createForm.valid;
  }
}
