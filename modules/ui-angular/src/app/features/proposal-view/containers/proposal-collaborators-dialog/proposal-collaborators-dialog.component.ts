import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EuiAutoCompleteItem } from '@eui/components/eui-autocomplete';
import { EuiDialogComponent } from '@eui/components/eui-dialog/eui-dialog.component';
import { Collaborator, CollaboratorRequest } from '@leos/shared';
import { debounceTime, retry, Subject, takeUntil } from 'rxjs';

import { ProposalDetailsService } from '../../services/proposal-details.service';

@Component({
  selector: 'app-proposal-collaborators-dialog',
  templateUrl: './proposal-collaborators-dialog.component.html',
  styleUrls: ['./proposal-collaborators-dialog.component.css'],
})
export class ProposalCollaboratorsDialogComponent implements OnInit, OnDestroy {
  quantity = 0;
  collaboratorsForm: FormGroup;
  MIN_QUANTITY_USER = 1;
  MAX_QUANTITY_USER = 20;
  userAutocompleteData: EuiAutoCompleteItem[] = [];
  destroy$ = new Subject<any>();

  @ViewChild('addCollaboratosModal') collaboratorsModal: EuiDialogComponent;

  constructor(
    private fb: FormBuilder,
    private detailsService: ProposalDetailsService,
  ) {}

  ngOnDestroy(): void {
    this.destroy$.next(null);
    this.destroy$.complete();
  }

  ngOnInit() {
    this.quantity = 0;
    this.collaboratorsForm = this.fb.group({
      collaborators: this.fb.array([]),
    });

    this.detailsService.userAutocompleteData$
      .pipe(takeUntil(this.destroy$))
      .subscribe((users) => {
        this.userAutocompleteData = [];
        users.forEach((user) => {
          if (user.entities.length > 1) {
            for (const entity of user.entities) {
              this.userAutocompleteData.push(
                new EuiAutoCompleteItem({
                  id: user.id,
                  label: user.name + ' (' + entity.organizationName + ')',
                  roles: user.role,
                  entities: user.entities,
                  defaultEntity: entity,
                  login: user.login,
                }),
              );
            }
          } else {
            this.userAutocompleteData.push(
              new EuiAutoCompleteItem({
                id: user.id,
                label:
                  user.name + ' (' + user.defaultEntity.organizationName + ')',
                roles: user.role,
                entities: user.entities,
                defaultEntity: user.defaultEntity,
                login: user.login,
              }),
            );
          }
        });
      });
  }

  openDialog() {
    this.collaboratorsModal.openDialog();
  }

  openCollaboratorsDialog() {
    this.collaboratorsModal.openDialog();
  }

  closeDialog() {
    this.collaboratorsModal.closeDialog();
    this.resetModal();
    this.detailsService.setUserAutocompleteInputChange('');
  }

  handleQuantityChange(value) {
    //case of adding
    if (value > this.MAX_QUANTITY_USER) {
      this.collaboratorsFormList.clear();
      return;
    }
    if (this.collaboratorsFormList.length < value) {
      for (let i = this.collaboratorsFormList.length; i < value; i++) {
        this.collaboratorsFormList.push(
          this.fb.group({
            name: ['', Validators.required],
            role: ['', Validators.required],
            entity: [{ value: '', disabled: true }, Validators.required],
            item: [{}],
            login: ['', Validators.required],
          }),
        );
      }
      this.addSubToFormArray();
      return;
    }
    //case of removing
    if (this.collaboratorsFormList.length > value) {
      for (let i = this.collaboratorsFormList.length; i > value; i--) {
        this.collaboratorsFormList.removeAt(i - 1);
      }
    }
  }

  addSubToFormArray() {
    this.collaboratorsFormList.controls.forEach((control) => {
      control.valueChanges
        .pipe(debounceTime(300), takeUntil(this.destroy$))
        .subscribe((value) => {
          this.detailsService.setUserAutocompleteInputChange(value.item.label);
        });
    });
  }

  handleAddUsers() {
    const collaboratorRawValue = this.collaboratorsFormList.getRawValue();
    const collaboratorsToAdd = collaboratorRawValue.map((value) => ({
      userId: value.login,
      roleName: value.role,
      connectedDG: value.entity,
    }));

    this.detailsService.addCallaborators({ collaborators: collaboratorsToAdd });
    this.resetModal();
    this.closeDialog();
  }

  handleNameSelect(event, i: number) {
    this.collaboratorsFormList.controls[i].patchValue({
      name: event.label,
      entity: event.defaultEntity.organizationName,
      role: 'OWNER',
      login: event.login,
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
    return (
      this.collaboratorsForm.valid && this.quantity >= this.MIN_QUANTITY_USER
    );
  }

  get isQuantityValid() {
    return this.quantity <= this.MAX_QUANTITY_USER;
  }

  removeCollaborator(i: number) {
    this.collaboratorsFormList.removeAt(i);
    this.quantity--;
  }

  resetModal() {
    this.quantity = 0;
    this.userAutocompleteData = [];
    this.collaboratorsForm = this.fb.group({
      collaborators: new FormArray([]),
    });
  }
}
