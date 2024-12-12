import { Collaborator, User, CollaboratorRequest } from '@/shared';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormArray,
  AbstractControl,
  ValidationErrors,
} from '@angular/forms';
import { EuiAutoCompleteItem } from '@eui/components/eui-autocomplete';
import { EuiDialogComponent } from '@eui/components/eui-dialog';
import { Subject, takeUntil, debounceTime, skip, take } from 'rxjs';
import { ProposalDetailsService } from '../../services/proposal-details.service';

@Component({
  selector: 'app-proposal-collaborators-dialog',
  templateUrl: './proposal-collaborators-dialog.component.html',
  styleUrls: ['./proposal-collaborators-dialog.component.css'],
})
export class ProposalCollaboratorsDialogComponent implements OnInit, OnDestroy {
  collaboratorsForm: FormGroup;
  MAX_QUANTITY_USER = 5;
  userAutocompleteData: EuiAutoCompleteItem[] = [];
  destroy$ = new Subject<any>();

  @ViewChild('addCollaboratorsModal') collaboratorsModal: EuiDialogComponent;

  protected addUsersError: HttpErrorResponse = null;
  private collaborators: Collaborator[] = [];

  constructor(
    private fb: FormBuilder,
    private detailsService: ProposalDetailsService,
  ) {}

  ngOnDestroy(): void {
    this.destroy$.next(null);
    this.destroy$.complete();
  }

  ngOnInit() {
    this.resetModal();

    this.detailsService.userAutocompleteData$
      .pipe(takeUntil(this.destroy$))
      .subscribe((users) => this.loadAutocompleteData(users));

    this.detailsService.collaborators$
      .pipe(takeUntil(this.destroy$))
      .subscribe((collaborators) =>
        this.setPersistedCollaborators(collaborators),
      );
  }

  openDialog() {
    this.collaboratorsModal.openDialog();
  }

  closeDialog() {
    this.collaboratorsModal.closeDialog();
    this.resetModal();
    this.detailsService.setUserAutocompleteInputChange('');
  }

  handleAddUsers(isRetry = false) {
    this.addUsersError = null;
    const collaboratorsToAdd = this.getFormCollaborators();

    this.detailsService
      .addCollaborators(collaboratorsToAdd, { skipError400Interception: true })
      .subscribe({
        next: () => this.closeDialog(),
        error: (e: HttpErrorResponse) => this.handleAddUsersError(e, isRetry),
      });
  }

  handleNameSelect(event, i: number) {
    this.collaboratorsFormList.controls[i].patchValue({
      name: event[0].label,
      entity: event[0].defaultEntity?.organizationName,
      role: 'OWNER',
      login: event[0].login,
    });
  }

  handleNameChanged(i: number) {
    this.collaboratorsFormList.controls[i].patchValue({
      name: '',
      entity: '',
      role: 'OWNER',
      login: ''
    });
  }

  handleRoleSelect(event, i: number) {
    this.collaboratorsFormList.controls[i]
      .get('role')
      .setValue(event.target.value);
  }

  get collaboratorsFormList() {
    return this.collaboratorsForm.get('collaborators') as FormArray;
  }

  get isFormValid() {
    return this.collaboratorsForm.valid && this.collaboratorsFormList.length > 0 &&
        this.collaboratorsFormList.length <= this.MAX_QUANTITY_USER;
  }

  addCollaborator(i?: number) {
    if (this.collaboratorsFormList.length < this.MAX_QUANTITY_USER) {
      this.collaboratorsFormList.insert((i ?? -1) + 1,
        this.fb.group(
          {
            name: ['', Validators.required],
            role: ['OWNER', Validators.required],
            entity: [{value: '', disabled: true}, Validators.required],
            item: [{}],
            login: ['', Validators.required],
          },
          {validators: (g) => this.validateCollaborator(g)},
        ),
      );
      this.addSubToFormArray();
    }
  }

  addSubToFormArray() {
    this.collaboratorsFormList.controls.forEach((control) => {
      control.valueChanges
        .pipe(debounceTime(300), takeUntil(this.destroy$))
        .subscribe((value) => {
          this.detailsService.setUserAutocompleteInputChange(
            value.item?.label ?? ''
          );
        });
    });
  }

  removeCollaborator(i: number) {
    if (this.collaboratorsFormList.length > 1) {
      this.collaboratorsFormList.removeAt(i);
    }
  }

  resetModal() {
    this.userAutocompleteData = [];
    this.collaboratorsForm = this.fb.group({
      collaborators: new FormArray([]),
    });
    this.addCollaborator();
    this.addUsersError = null;
  }

  private setPersistedCollaborators(collaborators: Collaborator[]) {
    this.collaborators = collaborators;
    this.collaboratorsFormList.controls.forEach((c) =>
      c.updateValueAndValidity(),
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
      (c) => c.login === user.login && c.entity?.id === user.defaultEntity.id,
    );
  }

  private getFormCollaborators() {
    return this.collaboratorsFormList.getRawValue().map(
      (value) =>
        ({
          userId: value.login,
          roleName: value.role,
          connectedDG: value.entity,
        } as CollaboratorRequest),
    );
  }

  private handleAddUsersError(e: HttpErrorResponse, isRetry = false) {
    if (isRetry) {
      this.addUsersError = e;
      return;
    }

    if (e.status === 400 && this.collaboratorsForm.valid) {
      // update collaborators and try again
      this.detailsService.fetchCollaborators();
      this.detailsService.collaborators$
        .pipe(skip(1), take(1), takeUntil(this.destroy$))
        .subscribe(() => {
          if (this.collaboratorsForm.valid) {
            // if form has no errors submit again
            this.handleAddUsers(true);
          } else {
            // else show generic error message
            this.addUsersError = e;
          }
        });
    }
  }

  /** Validates that the user is not already a collaborator or added in the list. */
  private validateCollaborator(
    control: AbstractControl,
  ): ValidationErrors | null {
    const getEntityId = (u?: User) => u?.defaultEntity?.id;
    const user = control.value.item as User;
    if (!user?.login) {
      return null;
    }

    const errors = [];
    const login = user?.login;
    const entityId = getEntityId(control.value.item);

    const isExisting = this.collaborators.some(
      (c) => c?.login === login && c.entity?.id === entityId,
    );
    if (isExisting) {
      errors.push('existing');
    }

    const formCollaborators = this.collaboratorsFormList.controls.map(
      (c) => c.value.item as User,
    );
    const isDuplicate = formCollaborators.some(
      (c) => c !== user && c?.login === login && getEntityId(c) === entityId,
    );
    if (isDuplicate) {
      errors.push('duplicate');
    }

    return errors.length
      ? errors.reduce((obj, error) => ({ ...obj, [error]: true }), {})
      : null;
  }
}
