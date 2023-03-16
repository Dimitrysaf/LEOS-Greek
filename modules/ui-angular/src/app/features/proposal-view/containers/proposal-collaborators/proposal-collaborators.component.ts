import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { EuiTableComponent } from '@eui/components/eui-table';
import { Collaborator, Entity, User, UserEntity } from '@leos/shared';
import { debounceTime, filter, Subject, take, takeUntil } from 'rxjs';

import { ConfirmDeleteDialogComponent } from '@/shared/components/confirm-delete-dialog/confirm-delete-dialog.component';

import { ProposalDetailsService } from '../../services/proposal-details.service';

@Component({
  selector: 'app-proposal-collaborators',
  templateUrl: './proposal-collaborators.component.html',
  styleUrls: ['./proposal-collaborators.component.scss'],
})
export class ProposalCollaboratorsComponent implements OnInit, OnDestroy {
  roles = ['Author', 'Contributor', 'Reviewer'];
  dataSource: Collaborator[] = [];
  filteredData: Collaborator[] = [];
  userInputForm: FormGroup;
  isEditRole = false;
  editUserId = null;
  destory$: Subject<any> = new Subject();
  entity: string;
  selectedRole: string;

  @ViewChild('collaboratos') collaboratorsTable: EuiTableComponent;
  @ViewChild('confirmCollabDelete') confirmComp: ConfirmDeleteDialogComponent;
  collaboratorToDelete: Collaborator = null;
  constructor(
    private fb: FormBuilder,
    private detailsService: ProposalDetailsService,
  ) {
    this.userInputForm = this.fb.group({
      searchTerm: [''],
    });

    this.detailsService.collaborators$
      .pipe(takeUntil(this.destory$))
      .subscribe((coll) => {
        this.dataSource = coll;
      });
  }

  ngOnDestroy(): void {
    this.destory$.next(null);
    this.destory$.complete();
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
      connectedDG: collab.entity.organizationName,
    });
    this.collaboratorToDelete = null;
  }

  hanldeOnChange(event) {
    //reset previous state
    this.detailsService.setCollaboratorsRole({
      userId: this.editUserId,
      roleName: event.target.value,
      connectedDG: this.entity,
    });
    this.isEditRole = false;
    this.editUserId = null;
  }

  public onFilterChange(event: any) {
    this.filteredData = this.collaboratorsTable.filterRows(
      event,
      this.dataSource,
    );
    // this._refreshTotalPopulation();
  }

  getIndexByRole() {
    if (this.selectedRole === 'OWNER') return 0;
    if (this.selectedRole === 'CONTRIBUTOR') return 1;
    if (this.selectedRole === 'REVIEWER') return 2;
  }
}
