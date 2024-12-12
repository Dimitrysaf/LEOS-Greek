import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { EuiTableComponent } from '@eui/components/eui-table';
import {Collaborator, Entity, Permission} from '@leos/shared';
import { Subject, takeUntil } from 'rxjs';

import { ConfirmDeleteDialogComponent } from '@/shared/components/confirm-delete-dialog/confirm-delete-dialog.component';

import { ProposalDetailsService } from '../../services/proposal-details.service';

@Component({
  selector: 'app-proposal-collaborators',
  templateUrl: './proposal-collaborators.component.html',
  styleUrls: ['./proposal-collaborators.component.scss'],
})
export class ProposalCollaboratorsComponent implements OnInit, OnDestroy {
  translated: boolean = false;
  roles = ['Author', 'Contributor', 'Reviewer', 'Viewer'];
  dataSource: Collaborator[] = [];
  filteredData: Collaborator[] = [];
  userInputForm: FormGroup;
  isEditRole = false;
  editUserId = null;
  destroy$: Subject<any> = new Subject();
  entity: string;
  selectedRole: string;
  permissions: Permission[];

  @ViewChild('collaborators') collaboratorsTable: EuiTableComponent;
  @ViewChild('confirmCollabDelete') confirmComp: ConfirmDeleteDialogComponent;
  collaboratorToDelete: Collaborator = null;
  constructor(
    private fb: FormBuilder,
    protected detailsService: ProposalDetailsService,
  ) {
    this.userInputForm = this.fb.group({
      searchTerm: [''],
    });

    this.detailsService.collaborators$
      .pipe(takeUntil(this.destroy$))
      .subscribe((coll) => {
        coll.forEach((c) => {
          if (c.role === 'OWNER') c.additionalRole = 'AUTHOR';
        });
        this.dataSource = coll;
      });
    this.detailsService.permissions$
      .pipe(takeUntil(this.destroy$))
      .subscribe((perms) => (this.permissions = perms));
    this.translated = this.detailsService.getTranslated();
  }

  ngOnDestroy(): void {
    this.destroy$.next(null);
    this.destroy$.complete();
  }

  ngOnInit(): void {}

  editCollaborator(id: number, entity: Entity, role: string) {
    this.isEditRole = true;
    this.editUserId = id;
    this.entity = entity.organizationName;
    this.selectedRole = role;
  }

  handleConfirmDeletion(coll: Collaborator) {
    this.collaboratorToDelete = coll;
    this.confirmComp.deleteDialog.openDialog();
  }

  deleteCollaborator() {
    const collab = this.collaboratorToDelete;
    this.detailsService.deleteCollaborator({
      userId: collab.login,
      roleName: collab.role,
      connectedDG: collab.entity?.organizationName,
    });
    this.collaboratorToDelete = null;
  }

  handleOnChange(event) {
    //reset previous state
    this.detailsService.setCollaboratorsRole({
      userId: this.editUserId,
      roleName: event.target.value,
      connectedDG: this.entity,
    });
    this.isEditRole = false;
    this.editUserId = null;
  }

  onFilterChange(event: string | null) {
    this.filteredData = this.collaboratorsTable.filterRows(
      event,
      this.dataSource,
    );
    // this._refreshTotalPopulation();
  }

  exitEditMode() {
    this.isEditRole = false;
    this.editUserId = null;
  }

  getIndexByRole() {
    if (this.selectedRole === 'OWNER') return 0;
    if (this.selectedRole === 'CONTRIBUTOR') return 1;
    if (this.selectedRole === 'REVIEWER') return 2;
    if (this.selectedRole === 'VIEWER') return 3;
  }
}
