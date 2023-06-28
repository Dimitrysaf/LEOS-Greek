import {
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
import { TranslateService } from '@ngx-translate/core';
import { Subject, takeUntil } from 'rxjs';

import { ProposalDetailsService } from '@/features/proposal-view/services/proposal-details.service';

type TypeOption = {
  label: string;
  value: string;
};

const OTHER_VALUE = 'other';

@Component({
  selector: 'app-add-milestone-dialog',
  templateUrl: './add-milestone-dialog.component.html',
  styleUrls: ['./add-milestone-dialog.component.scss'],
})
export class AddMilestoneDialogComponent implements OnInit, OnDestroy {
  @Input() isCloneProposal: boolean;
  @Output() closed = new EventEmitter();
  @ViewChild('dialog') dialog: EuiDialogComponent;
  form: FormGroup;
  types: any[];

  private defaultType;
  private destroy$: Subject<any> = new Subject();

  constructor(
    private fb: FormBuilder,
    private proposalDetailsService: ProposalDetailsService,
    private translateService: TranslateService,
  ) {}

  ngOnInit(): void {
    this.types = this.isCloneProposal
      ? this.getTypeOptionsClonedProposal()
      : this.getTypeOptions();
    this.defaultType = this.types[0];
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
      this.form.get('milestonesTitle').value,
      this.isCloneProposal,
    );
    this.close();
  }

  resetInitials(): void {
    this.form.patchValue({
      milestonesType: this.defaultType.value,
      milestonesTitle: this.defaultType.label,
    });
    this.form.clearValidators();
  }

  private buildForm() {
    this.form = this.fb.group({
      milestonesType: new FormControl(this.defaultType.value),
      milestonesTitle: new FormControl({
        value: this.defaultType.label,
        disabled: true,
      }),
    });
  }

  private getTypeOptionsClonedProposal() {
    const option = (key: string, value: string): TypeOption => ({
      label: this.translateService.instant(key),
      value,
    });
    return [
      option(
        'page.collection.milestones.type.cloned-proposal1',
        'Contribution from Legal Service',
      ),
      option('page.collection.milestones.type.other', OTHER_VALUE),
    ];
  }
  private getTypeOptions() {
    const option = (key: string, value: string): TypeOption => ({
      label: this.translateService.instant(key),
      value,
    });

    if (process.env.NG_APP_LEOS_INSTANCE === 'cn') {
      return [
        option(
          'page.collection.milestones.type.mandate1',
          'Meeting of the Council',
        ),
        option('page.collection.milestones.type.other', OTHER_VALUE),
      ];
    } else {
      return [
        option(
          'page.collection.milestones.type.proposal1',
          'For Interservice Consultation',
        ),
        option('page.collection.milestones.type.proposal2', 'For Decision'),
        option(
          'page.collection.milestones.type.proposal3',
          'Revision after Interservice Consultation',
        ),
        option('page.collection.milestones.type.other', OTHER_VALUE),
      ];
    }
  }

  private handleChanges() {
    this.form
      .get('milestonesType')
      .valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe((selectedValue) => {
        const milestonesTitle = this.form.get('milestonesTitle');
        if (selectedValue === OTHER_VALUE) {
          milestonesTitle.setValue('');
          milestonesTitle.enable();
          milestonesTitle.setValidators([Validators.required]);
        } else {
          const option = this.types.find((o) => o.value === selectedValue);
          milestonesTitle.setValue(option.label);
          milestonesTitle.disable();
          milestonesTitle.clearValidators();
        }
        milestonesTitle.updateValueAndValidity();
      });
  }
}
