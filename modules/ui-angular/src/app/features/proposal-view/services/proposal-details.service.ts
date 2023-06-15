import { HttpClient, HttpContext } from '@angular/common/http';
import { Injectable, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { UxAppShellService } from '@eui/core';
import {
  Collaborator,
  CollaboratorRequest,
  Document,
  LeosAppConfig,
  Permission,
  User,
} from '@leos/shared';
import { TranslateService } from '@ngx-translate/core';
import { parse as parseContentDisposition } from 'content-disposition-attachment';
import {
  BehaviorSubject,
  combineLatestWith,
  filter,
  finalize,
  map,
  Observable,
  Subject,
  switchMap,
  takeUntil,
  tap,
} from 'rxjs';
import { apiBaseUrl } from 'src/config';

import { AppConfigService } from '@/core/services/app-config.service';
import { IS_ERROR_INTERCEPTION_ENABLED } from '@/core/services/error-handler.interceptor';
import {
  CreateDraftBody,
  CreateDraftResponse,
} from '@/features/proposals/models';
import { MilestoneDescriptor } from '@/shared/components/proposal-milestone-view/proposal-milestone-view.component';
import { LoadingService } from '@/shared/services/loading.service';
import { downloadBlob } from '@/shared/utils';

import { ExportPackageVO } from '../models/export-package.model';
import { Milestone } from '../models/milestone.model';

@Injectable({ providedIn: 'root' })
export class ProposalDetailsService implements OnDestroy {
  collaborators$: Observable<Collaborator[]>;
  userAutocompleteData$: Observable<User[]>;
  proposalDetails$: Observable<Document>;
  userInputFieldChange$: Observable<string>;
  milestones$: Observable<Milestone[]>;
  exportedDocuments$: Observable<ExportPackageVO[]>;
  permissions$: Observable<Permission[]>;

  private collaboratorsBS = new BehaviorSubject<Collaborator[]>([]);
  private userInputFieldChangeBS = new BehaviorSubject('');
  private proposalRefBS = new BehaviorSubject<string>(null);
  private milestonesBS = new BehaviorSubject<Milestone[]>([]);
  private proposalDetailsResponse$ = this.proposalRefBS.pipe(
    switchMap(() => this.getProposalDetails()),
  );
  private permissionsBS = new BehaviorSubject<Permission[]>([]);

  private userAutocompleteDataResponse$ = this.userInputFieldChangeBS.pipe(
    filter((name) => name.length > 2),
    switchMap((name) => this.searchUsers(name)),
  );
  private destroy$ = new Subject<void>();

  constructor(
    private appConfig: AppConfigService,
    private http: HttpClient,
    private router: Router,
    private loadingService: LoadingService,
    private uxAppService: UxAppShellService,
    private translateService: TranslateService,
  ) {
    this.userInputFieldChange$ = this.userInputFieldChangeBS.asObservable();

    this.proposalDetails$ = this.proposalDetailsResponse$.pipe(
      tap((res) => this.fetchCollaborators()),
      tap((res) => this.loadingService.setLoading(false)),
      tap((res) => this.loadProposalMilestones()),
    );

    this.userAutocompleteData$ = this.userAutocompleteDataResponse$;

    this.exportedDocuments$ = this.proposalRefBS.pipe(
      switchMap(() => this.getAllExportDocuments()),
    );
    this.collaborators$ = this.collaboratorsBS.asObservable();
    this.milestones$ = this.milestonesBS.asObservable();

    this.permissions$ = this.permissionsBS.asObservable();
    this.collaborators$
      .pipe(takeUntil(this.destroy$), combineLatestWith(this.appConfig.config))
      .subscribe(([collaborators, config]) => {
        const permissions = this.resolvePermissions(collaborators, config);
        this.permissionsBS.next(permissions);
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  setUserAutocompleteInputChange(name: string) {
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

  downloadProposal() {
    this.loadingService.setLoading(true);
    this.http
      .get(`${apiBaseUrl}/secured/proposals/${this.proposalRef}/download`, {
        responseType: 'blob',
      })
      .subscribe({
        next: (blob) => downloadBlob(blob, `Proposal_${this.proposalRef}.zip`),
        complete: () => this.loadingService.setLoading(false),
      });
  }

  exportProposal(outputType: string) {
    this.http
      .get(
        `${apiBaseUrl}/secured/proposal/${this.proposalRef}/export?exportOutput=${outputType}`,
        { responseType: 'text' },
      )
      .subscribe({
        next: () => {
          this.appConfig.config.subscribe((c) => {
            const userEmail = c.user.email;
            this.translateService
              .get('page.editor.export-email-sent', { userEmail })
              .subscribe((message) => {
                this.uxAppService.growl({
                  severity: 'info',
                  summary: message,
                  life: 3000,
                  isGrowlSticky: false,
                  position: 'bottom-right',
                });
              });
          });
        },
        error: (err) => {
          // TODO : handle errors
          this.uxAppService.growlError(err.error);
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

  addCollaborators(
    collaborators: CollaboratorRequest[],
    options?: { skipError400Interception: boolean },
  ) {
    return this.http
      .post<null>(
        `${apiBaseUrl}/secured/proposal/${this.proposalRef}/bulkCollaborators`,
        { collaborators },
        {
          context: options?.skipError400Interception
            ? new HttpContext().set(
                IS_ERROR_INTERCEPTION_ENABLED,
                (err) => err.status !== 400,
              )
            : undefined,
        },
      )
      .pipe(tap(() => this.fetchCollaborators()));
  }

  setCollaboratorsRole(collaboratorToUpdate: CollaboratorRequest) {
    this.updateCollaboratorRole(collaboratorToUpdate);
  }

  deleteCollaborator(req: CollaboratorRequest) {
    this.deleteProposalCollaborators(req).subscribe(() =>
      this.fetchCollaborators(),
    );
  }

  loadProposalMilestones() {
    this.loadingService.setLoading(true);
    return this.http
      .get<Milestone[]>(
        `${apiBaseUrl}/secured/proposals/${this.proposalRef}/milestones`,
      )
      .subscribe((miles) => {
        this.milestonesBS.next(miles);
        this.loadingService.setLoading(false);
      });
  }

  createMilestone(milestoneComment: string) {
    this.loadingService.setLoading(true);
    return this.http
      .post(
        `${apiBaseUrl}/secured/proposals/${this.proposalRef}/milestones`,
        milestoneComment,
      )
      .subscribe(() => this.loadProposalMilestones());
  }

  sendMilestoneForContribution(milestone: MilestoneDescriptor, login: string) {
    this.loadingService.setLoading(true);
    const body = {
      legDocumentName: milestone.legDocumentName,
      userLogin: login,
    };
    return this.http
      .post(
        `${apiBaseUrl}/secured/contribution/create-clone-proposal/${this.proposalRef}`,
        body,
      )
      .subscribe({
        next: (res) => {
          this.uxAppService.growl({
            severity: 'success',
            summary: this.translateService.instant(
              'global.notifications.title.success',
            ),
            detail: this.translateService.instant(
              'page.collection.milestones.send-copy-for-contribution-dialog.contribution-success',
            ),
            life: 3000,
            isGrowlSticky: false,
            position: 'bottom-right',
          });
          this.loadProposalMilestones();
        },
        error: (res) => {
          this.loadingService.setLoading(false);
          this.uxAppService.growl({
            severity: 'danger',
            summary: this.translateService.instant(
              'page.collection.milestones.send-copy-for-contribution-dialog.contribution-error',
            ),
            detail: res,
            life: 3000,
            isGrowlSticky: false,
            position: 'bottom-right',
          });
        },
      });
  }

  sendRevisionForMerge(milestone: MilestoneDescriptor) {
    this.loadingService.setLoading(true);
    const body = {
      legFilename: milestone.legDocumentName,
    };
    return this.http
      .post(
        `${apiBaseUrl}/secured/contribution/revision-done/${this.proposalRef}`,
        body,
      )
      .subscribe({
        next: (res) => {
          this.uxAppService.growl({
            severity: 'success',
            summary: this.translateService.instant(
              'global.notifications.title.success',
            ),
            detail: this.translateService.instant(
              'page.collection.milestones.send-copy-for-contribution-send-revision-message-success',
            ),
            life: 3000,
            isGrowlSticky: false,
            position: 'bottom-right',
          });
          this.loadProposalMilestones();
        },
        error: (res) => {
          this.loadingService.setLoading(false);
          //todo remove if and keep second growl when bad request error is fixed
          if (res.status === 400) {
            this.uxAppService.growl({
              severity: 'success',
              summary: this.translateService.instant(
                'global.notifications.title.success',
              ),
              detail: this.translateService.instant(
                'page.collection.milestones.send-copy-for-contribution-send-revision-message-success',
              ),
              life: 3000,
              isGrowlSticky: false,
              position: 'bottom-right',
            });
            this.loadProposalMilestones();
          } else {
            this.uxAppService.growl({
              severity: 'danger',
              summary: this.translateService.instant(
                'page.collection.milestones.send-copy-for-contribution-send-revision-message-error',
              ),
              detail: res,
              life: 3000,
              isGrowlSticky: false,
              position: 'bottom-right',
            });
          }
        },
      });
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

  deleteExplanatory(explanatoryRef: string) {
    return this.http.delete<any>(
      `${apiBaseUrl}/secured/proposal/${this.proposalRef}/deleteExplanatory/${explanatoryRef}`,
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

  deleteExportDocument(exportId: string) {
    return this.http.delete<ExportPackageVO[]>(
      `${apiBaseUrl}/secured/proposal/${this.proposalRef}/deleteExport/${exportId}`,
    );
  }

  previewExport(exportId: string) {
    return this.http
      .get(
        `${apiBaseUrl}/secured/proposal/${this.proposalRef}/previewExport/${exportId}`,
        {
          observe: 'response',
          responseType: 'blob',
        },
      )
      .subscribe((resp) => {
        const cd = parseContentDisposition(
          resp.headers.get('Content-Disposition'),
        );
        const filename = cd.attachment ? cd.filename : 'Preview.docx';
        downloadBlob(resp.body, filename);
      });
  }

  notifyExport(exportId: string) {
    return this.http.get(
      `${apiBaseUrl}/secured/proposal/${this.proposalRef}/notifyExport/${exportId}`,
    );
  }

  getAllExportDocuments() {
    return this.http.get<ExportPackageVO[]>(
      `${apiBaseUrl}/secured/proposal/${this.proposalRef}/getExports`,
    );
  }

  updateExportDocument(exportId: string, comments: string[]) {
    return this.http.put<ExportPackageVO[]>(
      `${apiBaseUrl}/secured/proposal/${this.proposalRef}/updateExport/${exportId}`,
      comments,
    );
  }

  fetchCollaborators() {
    this.loadingService.setLoading(true);
    return this.http
      .get<Collaborator[]>(
        `${apiBaseUrl}/secured/proposal/${this.proposalRef}/collaborators`,
      )
      .subscribe((col) => {
        this.loadingService.setLoading(false);
        this.collaboratorsBS.next(col);
      });
  }

  hasPermissions(required: Permission[], any = false) {
    return this.permissions$.pipe(
      map((permissions) =>
        any
          ? required.some((p) => permissions.includes(p))
          : !required.some((p) => !permissions.includes(p)),
      ),
    );
  }

  private getProposalDetails(): Observable<Document> {
    this.loadingService.setLoading(true);
    return this.http.get<Document>(
      `${apiBaseUrl}/secured/proposals/${this.proposalRef}`,
    );
  }

  private updateCollaboratorRole(collaborator: CollaboratorRequest) {
    return this.http
      .put<any>(
        `${apiBaseUrl}/secured/proposal/${this.proposalRef}/collaborators`,
        {
          userId: collaborator.userId,
          roleName: collaborator.roleName,
          connectedDG: collaborator.connectedDG,
        },
      )
      .subscribe(() => this.fetchCollaborators());
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

  private resolvePermissions(
    collaborators: Collaborator[],
    config: LeosAppConfig,
  ) {
    const docRoles = collaborators
      .filter((c) => c.login === config.user.login)
      .map((c) => c.role);
    const roles = [...config.user.roles, ...docRoles];
    const permissions = roles.flatMap((r) => config.permissionsMap[r]);
    return [...new Set(permissions)];
  }
}
