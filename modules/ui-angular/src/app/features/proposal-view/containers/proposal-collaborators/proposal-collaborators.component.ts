import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Collaborator, Entity, User, UserEntity } from '@leos/shared';
import { debounceTime, filter, Subject, take, takeUntil } from 'rxjs';

import { ProposalDetailsService } from '../../services/proposal-details.service';

@Component({
  selector: 'app-proposal-collaborators',
  templateUrl: './proposal-collaborators.component.html',
  styleUrls: ['./proposal-collaborators.component.scss'],
})
export class ProposalCollaboratorsComponent implements OnInit, OnDestroy {
  roles = ['Author', 'Contributor', 'Reviewer'];
  dataSource: Collaborator[] = [];
  userInputForm: FormGroup;
  isEditRole = false;
  editUserId = null;
  destory$: Subject<any> = new Subject();
  entity: string;
  selectedRole: string;

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
  }

  ngOnInit(): void {}

  handleSearchUserInput(value: string) {
    //TODO :hanlde search either on FE or BE[to be discused]
    console.log(value);
  }

  editCollaborator(id: number, entity: Entity, role: string) {
    this.isEditRole = true;
    this.editUserId = id;
    this.entity = entity.organizationName;
    this.selectedRole = role;
  }

  deleteCollaborator(row) {
    this.detailsService.deleteCollaborator({
      userId: row.login,
      roleName: row.role,
      connectedDG: row.entity.organizationName,
    });
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

  getIndexByRole() {
    if (this.selectedRole === 'OWNER') return 0;
    if (this.selectedRole === 'CONTRIBUTOR') return 1;
    if (this.selectedRole === 'REVIEWER') return 2;
  }
}
