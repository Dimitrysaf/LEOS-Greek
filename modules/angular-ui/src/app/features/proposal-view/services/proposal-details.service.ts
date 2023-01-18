import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { EuiAutoCompleteItem } from '@eui/components/eui-autocomplete';
import { Collaborator, Document, User } from '@leos/shared';
import {
  BehaviorSubject,
  filter,
  map,
  Observable,
  switchMap,
  take,
  tap,
} from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ProposalDetailsService {
  userAutocompleteData$: Observable<EuiAutoCompleteItem[]>;
  proposalDetails$: Observable<Document>;
  userInputFieldChange$: Observable<string>;
  addCollaborator$: Observable<Collaborator>;
  loading$: Observable<boolean>;
  error$: Observable<string>;

  private loadingBS = new BehaviorSubject<boolean>(false);
  private errorBS = new BehaviorSubject<string>('');
  private collaboratorsBS = new BehaviorSubject<Collaborator[]>([]);
  private userInputFieldChangeBS = new BehaviorSubject<string>(null);
  private proposalRefBS = new BehaviorSubject<string>(null);

  private proposalDetailsResponse$ = this.proposalRefBS.pipe(
    switchMap((ref) => this.getProposalDetails(ref)),
  );

  private userAutocompleteDataResponse$ = this.userInputFieldChangeBS.pipe(
    filter((name) => name !== null),
    switchMap((name) => this.searchUsers(name)),
  );

  constructor(private http: HttpClient) {
    this.userInputFieldChange$ = this.userInputFieldChangeBS.asObservable();

    this.proposalDetails$ = this.proposalDetailsResponse$.pipe(
      tap((res) => this.collaboratorsBS.next(res.collaborators)),
      map((res: any) => res),
    );

    this.userAutocompleteData$ = this.userAutocompleteDataResponse$.pipe(
      map((users: any) =>
        users.map(
          (user) =>
            new EuiAutoCompleteItem({
              id: user.id,
              label: user.fullName,
              roles: user.role,
              entity: user.organisationRef.abbreviation,
              entityId: user.organisationRef.id,
            }),
        ),
      ),
    );
  }

  get collaborators$() {
    return this.collaboratorsBS.asObservable();
  }

  setUserAutocompleteInputChange(name: string) {
    if (name === null) {
      this.userInputFieldChangeBS.next('');
    }
    this.userInputFieldChangeBS.next(name);
  }

  setProposalRef(proposalRef: string) {
    this.proposalRefBS.next(proposalRef);
  }

  getProposalRef(): string {
    return this.proposalRefBS.getValue();
  }

  addCallaborators(collaboratorsToAdd: Collaborator[]) {
    const proposalId = this.proposalRefBS.getValue();
    if (collaboratorsToAdd === null) {
      return;
    }
    this.addCollaborators(proposalId, collaboratorsToAdd)
      .pipe(
        tap((col) => this.collaboratorsBS.next(col as Collaborator[])),
        take(1),
      )
      .subscribe((col) => {});
  }

  setCollaboratorsRole(userId: string, role: string) {
    const proposalId = this.proposalRefBS.getValue();
    this.setCollaboratorRole(proposalId, userId, role)
      .pipe(
        tap((col) => this.collaboratorsBS.next(col)),
        take(1),
      )
      .subscribe((col) => {});
  }

  deleteCollaborator(userId: string) {
    const proposalId = this.proposalRefBS.getValue();
    const collaborators = this.collaboratorsBS.getValue();
    const collaboratorsAfterDelete = collaborators.filter(
      (c) => c.id !== userId,
    );
    this.deleteProposalCollaborators(proposalId, userId)
      .pipe(
        tap(() => this.collaboratorsBS.next(collaboratorsAfterDelete)),
        take(1),
      )
      .subscribe(() => {});
  }

  private getProposalDetails(proposalRef: string): Observable<Document> {
    return this.http.get<Document>(`api/secured/proposals/${proposalRef}`);
  }

  private addCollaborators(proposalId: string, collaborators: Collaborator[]) {
    return this.http.post<Collaborator[]>(
      `api/secured/proposals/${proposalId}/addCollaborator`,
      {
        collaborators,
      },
    );
  }

  private setCollaboratorRole(
    proposalId: string,
    userId: string,
    role: string,
  ) {
    return this.http.put<Collaborator[]>(
      `api/secured/proposals/${proposalId}/collaborators/${userId}`,
      {
        role,
      },
    );
  }

  private deleteProposalCollaborators(
    proposalId: string,
    userId: string,
  ): Observable<Collaborator[]> {
    return this.http.delete<any>(
      `api/secured/proposals/${proposalId}/collaborators/${userId}`,
    );
  }

  private searchUsers(name: string): Observable<User[]> {
    return this.http.get<User[]>(`api/secured/users/searchUsers`, {
      params: { name },
    });
  }
}
