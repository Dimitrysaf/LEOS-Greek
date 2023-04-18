import {
  Component,
  EventEmitter,
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
import { TranslateService } from '@ngx-translate/core';
import { Subject, takeUntil } from 'rxjs';

import { ProposalDetailsService } from '@/features/proposal-view/services/proposal-details.service';

@Component({
  selector: 'app-add-milestone-dialog',
  templateUrl: './add-milestone-dialog.component.html',
  styleUrls: ['./add-milestone-dialog.component.scss'],
})
export class AddMilestoneDialogComponent implements OnInit, OnDestroy {
  @Output() closed = new EventEmitter();
  @ViewChild('dialog') dialog: EuiDialogComponent;
  form: FormGroup;

  private defaultMilestoneType = this.translateService.instant(
    'page.collection.milestones.type.1',
  );
  private destroy$: Subject<any> = new Subject();

  constructor(
    private fb: FormBuilder,
    private proposalDetailsService: ProposalDetailsService,
    private translateService: TranslateService,
  ) {}

  ngOnInit(): void {
    this.buildForm();
    this.handleChanges();
  }

  ngOnDestroy(): void {
    this.destroy$.next(null);
    this.destroy$.unsubscribe();
  }

  open() {
    this.dialog.openDialog();
  }

  close() {
    this.resetInitials();
    this.dialog.closeDialog();
    this.closed.emit();
  }

  onAccept(): void {
    this.proposalDetailsService.createMilestone(
      this.proposalDetailsService.proposalRef,
      this.form.get('milestonesTitle').value,
    );
    this.close();
  }

  resetInitials(): void {
    this.form.patchValue({
      milestonesType: this.defaultMilestoneType,
      milestonesTitle: this.defaultMilestoneType,
    });
    this.form.clearValidators();
  }

  private buildForm() {
    this.form = this.fb.group({
      milestonesType: new FormControl(this.defaultMilestoneType),
      milestonesTitle: new FormControl({
        value: this.defaultMilestoneType,
        disabled: true,
      }),
    });
  }

  private handleChanges() {
    this.form
      .get('milestonesType')
      .valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe((selectedValue) => {
        const milestonesTitle = this.form.get('milestonesTitle');
        if (selectedValue !== 'other') {
          milestonesTitle.setValue(selectedValue);
          milestonesTitle.disable();
          milestonesTitle.clearValidators();
        } else {
          milestonesTitle.setValue('');
          milestonesTitle.enable();
          milestonesTitle.setValidators([Validators.required]);
        }
        milestonesTitle.updateValueAndValidity();
      });
  }
}
