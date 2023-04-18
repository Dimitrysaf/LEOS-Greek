import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { UxAppShellService } from '@eui/core';
import {
  Collaborator,
  CollaboratorRequest,
  CollaboratorsBulkRequest,
  Document,
  User,
} from '@leos/shared';
import { TranslateService } from '@ngx-translate/core';
import {
  BehaviorSubject,
  filter,
  finalize,
  forkJoin,
  map,
  Observable,
  switchMap,
  tap,
} from 'rxjs';
import { apiBaseUrl } from 'src/config';

import {
  CreateDraftBody,
  CreateDraftResponse,
} from '@/features/proposals/models';
import { LoadingService } from '@/shared/services/loading.service';

import { ExportPackageVO } from '../models/export-package.model';
import { Milestone } from '../models/milestone.model';

@Injectable({ providedIn: 'root' })
export class ProposalDetailsService {
  userAutocompleteData$: Observable<any[]>;
  proposalDetails$: Observable<Document>;
  userInputFieldChange$: Observable<string>;
  addCollaborator$: Observable<Collaborator>;
  exportedDocuments$: Observable<ExportPackageVO[]>;
  error$: Observable<string>;

  private errorBS = new BehaviorSubject<string>('');
  private collaboratorsBS = new BehaviorSubject<Collaborator[]>([]);
  private userInputFieldChangeBS = new BehaviorSubject<string>(null);
  private proposalRefBS = new BehaviorSubject<string>(null);
  private milestonesBS = new BehaviorSubject<Milestone[]>([]);
  private proposalDetailsResponse$ = this.proposalRefBS.pipe(
    switchMap((ref) => this.getProposalDetails(ref)),
  );

  private userAutocompleteDataResponse$ = this.userInputFieldChangeBS.pipe(
    filter((name) => name !== null && name.length > 2),
    switchMap((name) => this.searchUsers(name)),
  );

  constructor(
    private http: HttpClient,
    private router: Router,
    private loadingService: LoadingService,
    private uxAppService: UxAppShellService,
    private translateService: TranslateService,
  ) {
    this.userInputFieldChange$ = this.userInputFieldChangeBS.asObservable();

    this.proposalDetails$ = this.proposalDetailsResponse$.pipe(
      tap((res) => this.getAllCollaborators(this.proposalRef)),
      tap((res) => this.loadingService.setLoading(false)),
      tap((res) => this.getProposalMilestones(this.proposalRef)),
    );

    this.userAutocompleteData$ = this.userAutocompleteDataResponse$.pipe(
      map((users: any) => users),
    );

    this.exportedDocuments$ = this.proposalRefBS.pipe(
      switchMap((ref) => this.getAllExportDocuments(ref)),
    );
  }

  get collaborators$() {
    return this.collaboratorsBS.asObservable();
  }

  get milestones$() {
    return this.milestonesBS.asObservable();
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

  get proposalRef(): string {
    return this.proposalRefBS.getValue();
  }

  createAnnex() {
    this.loadingService.setLoading(true);
    this.http
      .post<any>(
        `${apiBaseUrl}/secured/proposals/${this.proposalRef}/createAnnex`,
        {},
      )
      .subscribe((val) => {
        this.setProposalRef(this.proposalRef);
        this.loadingService.setLoading(false);
      });
  }

  updateAnnexTitle(annexId: string, annexTitle: string) {
    this.loadingService.setLoading(true);
    this.http
      .put<any>(
        `${apiBaseUrl}/secured/proposals/${this.proposalRef}/update-annex-title/${annexId}`,
        {},
        { params: { title: annexTitle } },
      )
      .subscribe((val) => {
        this.setProposalRef(this.proposalRef);
        this.loadingService.setLoading(false);
      });
  }

  deleteAnnex(annexRef: string) {
    this.loadingService.setLoading(true);
    this.http
      .delete<any>(
        `${apiBaseUrl}/secured/proposals/${this.proposalRef}/deleteAnnex/${annexRef}`,
        {},
      )
      .subscribe({
        next: (res) => this.setProposalRef(this.proposalRef),
        error: (res) => {
          this.loadingService.setLoading(false);
          this.uxAppService.growl({
            severity: 'danger',
            summary: this.translateService.instant(
              'page.collection.drafts.annex.deletion.error',
            ),
            detail: res,
            life: 3000,
            isGrowlSticky: false,
            position: 'bottom-right',
          });
        },
      });
  }

  updateAnnexOrder(
    annexRef: string,
    moveDirection: string,
    timesToMove: number,
  ) {
    this.loadingService.setLoading(true);
    this.http
      .post<any>(
        `${apiBaseUrl}/secured/updateAnnexOrder/${this.proposalRef}/annex/${annexRef}?moveDirection=${moveDirection}&timesToMove=${timesToMove}`,
        {},
      )
      .subscribe(() => {
        this.loadingService.setLoading(false);
        this.setProposalRef(this.proposalRef);
      });
  }

  updateProposalMetadata(docPurpose: string, eeaRelevance: boolean) {
    this.http
      .put<any>(`${apiBaseUrl}/secured/proposal/${this.proposalRef}`, {
        docPurpose,
        eeaRelevance,
        title: '',
      })
      .subscribe((val) => {
        this.proposalRefBS.next(this.proposalRef);
      });
  }

  donwloadProposal() {
    this.http
      .get(`${apiBaseUrl}/secured/proposals/${this.proposalRef}/download`, {
        responseType: 'blob',
      })
      .pipe(
        tap(() => this.loadingService.setLoading(true)),
        map((res) => {
          this.downloadFile(
            res,
            'application/zip',
            `Proposal_${this.proposalRef}`,
          );
        }),
      )
      .subscribe(() => {
        this.loadingService.setLoading(false);
      });
  }

  exportProposal(outputType: string) {
    this.http
      .get<any>(
        `${apiBaseUrl}/secured/proposal/${this.proposalRef}/export?exportOutput=${outputType}`,
      )
      .subscribe({
        next: (res) =>
          // TODO : service is unvailable
          console.log('exporting'),
        error: (err) => {
          // TODO : handle errors
          // this.uxAppService.growlError(err.error);
        },
      });
  }

  deleteProposal() {
    this.loadingService.setLoading(true);
    this.http
      .delete<string>(`${apiBaseUrl}/secured/proposal/${this.proposalRef}`)
      .subscribe(() => {
        this.loadingService.setLoading(false);
        this.router.navigate(['/workspace']);
      });
  }

  addCallaborators(collaboratorsToAdd: CollaboratorsBulkRequest) {
    const proposalId = this.proposalRefBS.getValue();
    if (collaboratorsToAdd === null) {
      return;
    }
    this.addCollaborators(proposalId, collaboratorsToAdd);
  }

  setCollaboratorsRole(collaboratorToUpdate: CollaboratorRequest) {
    const proposalId = this.proposalRefBS.getValue();
    this.updateCollaboratorRole(proposalId, collaboratorToUpdate);
  }

  deleteCollaborator(req: CollaboratorRequest) {
    const proposalId = this.proposalRefBS.getValue();
    this.deleteProposalCollaborators(req)
      .pipe()
      .subscribe(() => {
        this.getAllCollaborators(proposalId);
      });
  }

  getProposalMilestones(documentRef: string) {
    this.loadingService.setLoading(true);
    return this.http
      .get<Milestone[]>(
        `${apiBaseUrl}/secured/proposals/${documentRef}/milestones`,
      )
      .subscribe((miles) => {
        this.milestonesBS.next(miles);
        this.loadingService.setLoading(false);
      });
  }

  createMilestone(documentRef: string, milestoneComment: string) {
    this.loadingService.setLoading(true);
    return this.http
      .post(
        `${apiBaseUrl}/secured/proposals/${documentRef}/milestones`,
        milestoneComment,
      )
      .subscribe((val) => this.getProposalMilestones(documentRef));
  }

  updateExplanatoryTitle(docId: string, title: string) {
    this.loadingService.setLoading(true);
    this.http
      .put<any>(
        `${apiBaseUrl}/secured/proposals/${this.proposalRef}/update-explanatory-title/${docId}`,
        {},
        { params: { title } },
      )
      .subscribe((val) => {
        this.setProposalRef(this.proposalRef);
        this.loadingService.setLoading(false);
      });
  }

  deleteExplanatory(proposalRef: string, explanatoryRef: string) {
    return this.http.delete<any>(
      `${apiBaseUrl}/secured/proposal/${proposalRef}/deleteExplanatory/${explanatoryRef}`,
    );
  }

  createExplanatory(data: CreateDraftBody) {
    this.loadingService.setLoading(true);
    return this.http
      .post<CreateDraftResponse>(
        `${apiBaseUrl}/secured/proposal/createExplanatory`,
        data,
      )
      .pipe(finalize(() => this.loadingService.setLoading(false)));
  }

  deleteExportDocument(proposalRef: string, exportId: string) {
    return this.http.delete<ExportPackageVO[]>(
      `${apiBaseUrl}/secured/proposal/${proposalRef}/deleteExport/${exportId}`,
    );
  }

  previewExport(proposalRef: string, exportId: string) {
    return this.http.get(
      `${apiBaseUrl}/secured/proposal/${proposalRef}/previewExport/${exportId}`,
    );
  }

  notifyExport(proposalRef: string, exportId: string) {
    return this.http.get(
      `${apiBaseUrl}/secured/proposal/${proposalRef}/notiftExport/${exportId}`,
    );
  }

  getAllExportDocuments(proposalRef: string) {
    return this.http.get<ExportPackageVO[]>(
      `${apiBaseUrl}/secured/proposal/${proposalRef}/getExports`,
    );
  }

  updateExportDocument(
    proposalRef: string,
    exportId: string,
    comments: string[],
  ) {
    return this.http.put<ExportPackageVO[]>(
      `${apiBaseUrl}/secured/proposal/${proposalRef}/updateExport/${exportId}`,
      comments,
    );
  }

  private getProposalDetails(proposalRef: string): Observable<Document> {
    this.loadingService.setLoading(true);
    return this.http.get<Document>(
      `${apiBaseUrl}/secured/proposals/${proposalRef}`,
    );
  }

  private getAllCollaborators(prposalRef: string) {
    this.loadingService.setLoading(true);
    return this.http
      .get<Collaborator[]>(
        `${apiBaseUrl}/secured/proposal/${[prposalRef]}/collaborators`,
      )
      .subscribe((col) => {
        this.loadingService.setLoading(false);
        this.collaboratorsBS.next(col);
      });
  }

  private addCollaborators(
    proposalId: string,
    collaboratorsBulkReq: CollaboratorsBulkRequest,
  ) {
    return this.http
      .post<any>(
        `${apiBaseUrl}/secured/proposal/${proposalId}/bulkCollaborators`,
        {
          collaborators: collaboratorsBulkReq.collaborators,
        },
      )
      .subscribe(() => this.getAllCollaborators(this.proposalRef));
  }

  private updateCollaboratorRole(
    proposalId: string,
    collaborator: CollaboratorRequest,
  ) {
    return this.http
      .put<any>(`${apiBaseUrl}/secured/proposal/${proposalId}/collaborators`, {
        userId: collaborator.userId,
        roleName: collaborator.roleName,
        connectedDG: collaborator.connectedDG,
      })
      .subscribe((col) => {
        this.getAllCollaborators(this.proposalRef);
      });
  }

  private deleteProposalCollaborators(
    collaborator: CollaboratorRequest,
  ): Observable<Collaborator[]> {
    return this.http.delete<any>(
      `${apiBaseUrl}/secured/proposal/${this.proposalRef}/collaborators`,
      {
        body: {
          userId: collaborator.userId,
          roleName: collaborator.roleName,
          connectedDG: collaborator.connectedDG,
        },
      },
    );
  }

  private searchUsers(name: string): Observable<User[]> {
    return this.http.get<User[]>(`${apiBaseUrl}/secured/proposal/searchUser`, {
      params: { searchKey: name },
    });
  }

  private downloadFile(data: any, type: string, filename: string) {
    const blob = new Blob([data], {
      type: 'application/zip',
    });
    const url = window.URL.createObjectURL(blob);
    window.open(url);
  }
}
