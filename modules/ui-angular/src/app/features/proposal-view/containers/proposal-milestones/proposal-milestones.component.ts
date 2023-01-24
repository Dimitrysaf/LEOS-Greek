import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import {
  EuiDialogComponent,
  EuiDialogService,
} from '@eui/components/eui-dialog';
import { Subject, takeUntil } from 'rxjs';

import { ProposalDetailsService } from '@/features/proposal-view/services/proposal-details.service';

import { Milestone } from '../../models/milestone.model';
import { ProposalMilestonesService } from '../../services/proposal-milestones.service';

@Component({
  selector: 'app-proposal-milestones',
  templateUrl: './proposal-milestones.component.html',
  styleUrls: ['./proposal-milestones.component.scss'],
})
export class ProposalMilestonesComponent implements OnInit, OnDestroy {
  @ViewChild('milestonesDialog') milestonesDialog: EuiDialogComponent;
  form: FormGroup;
  dataSource: Milestone[] = [];
  destroy$: Subject<any> = new Subject();

  listItems = [
    { id: '1', label: 'View' },
    { id: '2', label: 'Send a copy for contribution' },
    { id: '3', label: 'Delete' },
  ];

  status = [
    { value: 'File error', color: 'eui-u-color-danger-100' },
    { value: 'Status 1', color: 'eui-u-color-success-100' },
    { value: 'Status 2', color: 'eui-u-color-info-100' },
  ];

  constructor(
    private euiDialogService: EuiDialogService,
    private proposalMilestonesService: ProposalMilestonesService,
    private proposalDetailsService: ProposalDetailsService,
    private fb: FormBuilder,
  ) {}

  ngOnInit(): void {
    this.buildForm();
    this.handleChanges();
    const proposalRef = this.proposalDetailsService.proposalRef;
    this.proposalDetailsService.milestones$
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (milestones) => {
          console.log('Milestones => ', milestones);
          this.dataSource = milestones;
        },
        error: (error) => {
          console.log('Error => ', error);
        },
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next(null);
    this.destroy$.unsubscribe();
  }

  getValue() {
    return this.form && this.form.get('milestonesType').value;
  }

  findStatusColor(val: string) {
    // return this.status.find((obj) => obj.value === val).color;
  }

  deleteMilestone(id: string) {
    console.log(`Delete milestone ${id}`);
    this.proposalMilestonesService.deleteMilestone(id);
  }

  // Template sample
  openDialog(): void {
    this.milestonesDialog.openDialog();
  }

  onClickOutside(): void {
    console.log('clickOutside from output');
    this.milestonesDialog.closeDialog();
  }

  onClose(): void {
    console.log('close from output');
    this.milestonesDialog.closeDialog();
  }

  onAccept(): void {
    this.milestonesDialog.closeDialog();
    this.proposalDetailsService.createMilestone(
      this.proposalDetailsService.proposalRef,
      this.form.get('milestonesTitle').value,
    );
  }

  onDismiss(): void {
    console.log('dismiss from output');
    this.milestonesDialog.closeDialog();
  }

  private buildForm() {
    this.form = this.fb.group({
      milestonesType: new FormControl('For Interservice Consultation'),
      milestonesTitle: new FormControl({
        value: 'For Interservice Consultation',
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
          milestonesTitle.setValidators(Validators.required);
        }
        milestonesTitle.updateValueAndValidity();
      });
  }
}
