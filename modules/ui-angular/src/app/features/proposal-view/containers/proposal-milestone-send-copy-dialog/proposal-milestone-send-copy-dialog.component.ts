import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  Renderer2,
  ViewChild,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EuiAutoCompleteItem } from '@eui/components/eui-autocomplete';
import { Subject, takeUntil } from 'rxjs';

import { Collaborator, User } from '@/shared';
import { MilestoneDescriptor } from '@/shared/components/proposal-milestone-view/proposal-milestone-view.component';

import { ProposalDetailsService } from '../../services/proposal-details.service';
import { EuiDialogComponent } from '@eui/components/eui-dialog';

@Component({
  selector: 'app-proposal-milestone-send-copy-dialog',
  templateUrl: './proposal-milestone-send-copy-dialog.component.html',
  styleUrls: ['./proposal-milestone-send-copy-dialog.component.scss'],
})
export class ProposalMilestoneSendCopyDialogComponent
  implements OnInit, OnDestroy
{
  @Input() milestone: MilestoneDescriptor;
  @Output() closed = new EventEmitter();
  targetUserForm: FormGroup;
  userAutocompleteData: EuiAutoCompleteItem[] = [];
  destroy$ = new Subject<any>();

  @ViewChild('sendCopyMilestoneForContributionModal')
  sendCopyMilestoneForContributionModal: EuiDialogComponent;

  private collaborators: Collaborator[] = [];

  constructor(
    private fb: FormBuilder,
    private detailsService: ProposalDetailsService,
    private cdr: ChangeDetectorRef,
    private renderer: Renderer2,
  ) {}

  ngOnDestroy(): void {
    this.destroy$.next(null);
    this.destroy$.complete();
  }

  ngOnInit() {
    this.resetModal();
    this.targetUserForm.controls.targetUser.updateValueAndValidity();

    this.detailsService.userAutocompleteData$
      .pipe(takeUntil(this.destroy$))
      .subscribe((users) => this.loadAutocompleteData(users));

    this.detailsService.collaborators$
      .pipe(takeUntil(this.destroy$))
      .subscribe((collaborators) => (this.collaborators = collaborators));
  }

  ngAfterViewInit() {
    setTimeout(() => {
      const targetElement = document.querySelector('.eui-dialog-container');
      if (targetElement) {
        const grandParentElement = targetElement.parentElement;
        if (grandParentElement) {
          this.renderer.addClass(
            grandParentElement,
            'cdk-overlay-panel-upload',
          );
        }
      }
      this.cdr.detectChanges();
    }, 0);
  }

  open() {
    this.sendCopyMilestoneForContributionModal.openDialog();
  }

  close() {
    this.sendCopyMilestoneForContributionModal.closeDialog();
    this.resetModal();
    this.closed.emit();
    this.detailsService.setUserAutocompleteInputChange('');
  }

  handleSendMilestoneCopyForContribution() {
    this.detailsService.sendMilestoneForContribution(
      this.milestone,
      this.targetUserForm.getRawValue().targetUser.login,
    );
    this.close();
  }

  handleNameChange(event) {
    this.detailsService.setUserAutocompleteInputChange(event);
  }

  handleNameClear(_event) {
    this.resetModal();
    this.detailsService.setUserAutocompleteInputChange('');
  }

  resetModal() {
    this.userAutocompleteData = [];
    this.targetUserForm = this.fb.group({
      targetUser: [{ value: '', disabled: false }, [Validators.required]],
    });
  }

  get isFormValid() {
    return (
      this.targetUserForm.valid &&
      Boolean(this.targetUserForm.getRawValue().targetUser.login)
    );
  }

  private loadAutocompleteData(users: User[]) {
    this.userAutocompleteData = users
      .flatMap(this.expandEntities)
      .filter((user) => !this.existingCollaborator(user))
      .map(this.userToAutoCompleteItem);
  }

  private expandEntities(user: User) {
    return user.entities.map(
      (entity) =>
        ({
          ...user,
          defaultEntity: entity,
        } as User),
    );
  }

  private userToAutoCompleteItem(user: User) {
    const label = user.defaultEntity.organizationName
      ? `${user.name} (${user.defaultEntity.organizationName})`
      : user.name;

    return new EuiAutoCompleteItem({
      ...user,
      label,
      tooltip: { tooltipMessage: label },
    });
  }

  private existingCollaborator(user: User) {
    return this.collaborators.some(
      (c) => c.login === user.login && c.entity.id === user.defaultEntity.id,
    );
  }
}
