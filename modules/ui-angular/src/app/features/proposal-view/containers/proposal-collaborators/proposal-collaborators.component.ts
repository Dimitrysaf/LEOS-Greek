import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Collaborator, User } from '@leos/shared';
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

  ngOnInit(): void {
    this.userInputForm.valueChanges
      .pipe(
        filter((s) => s.searchTerm.length > 2),
        debounceTime(400),
        takeUntil(this.destory$),
      )
      .subscribe((value) => {
        //call api
        // console.log(value.searchTerm);
      });
  }

  handleSearchUserInput(value: string) {
    //TODO :hanlde search either on FE or BE[to be discused]
    console.log(value);
  }

  editCollaborator(id: number) {
    this.isEditRole = true;
    this.editUserId = id;
  }

  getRoleOfCallaborator() {
    const collaborator = this.dataSource.find((x) => x.id === this.editUserId);
    if (collaborator) {
      return this.roles.indexOf(collaborator.role);
    }
  }

  deleteCollaborator(id: string) {
    this.detailsService.deleteCollaborator(id);
  }

  hanldeOnChange(event) {
    //reset previous state
    this.detailsService.setCollaboratorsRole(
      this.editUserId,
      event.target.value,
    );
    this.isEditRole = false;
    this.editUserId = null;
  }
}
