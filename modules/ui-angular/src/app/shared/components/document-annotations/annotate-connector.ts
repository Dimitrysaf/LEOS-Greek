import {delay, finalize, Observable, shareReplay, Subscriber, takeUntil} from 'rxjs';

import {MergeContributionsService} from "@/features/akn-document/services/merge-contributions.service";
import { AbstractJavaScriptComponent } from '@/features/leos-legacy/abstract-java-script-component';
import { LeosJavaScriptExtensionState } from '@/features/leos-legacy/models';
import type {
  AnnotateConnectorState, Collaborator,
  MergeSuggestionRequest,
  Permission, User, CollaboratorRequest
} from '@/shared';
import { AnnotateService } from '@/shared/services/annotate.service';
import { DocumentService } from '@/shared/services/document.service';
import {ProposalMilestonesService} from "@/shared/services/proposal-milestones.service";
import {ProposalDetailsService} from "@/features/proposal-view/services/proposal-details.service";
import {EuiDialogService} from "@eui/components/eui-dialog";
import {TranslateService} from "@ngx-translate/core";
import {CKEditorService} from "@/features/akn-document/services/ckeditor.service";

export type AnnotateConnectorInitialState = Omit<
  AnnotateConnectorState,
  keyof LeosJavaScriptExtensionState
>;
export type AnnotateConnectorOptions = {
  permissions: Permission[];
  responseFilteredAnnotations?: (annotations: string) => void;
};

const CACHE_TIME = 1000;

export class AnnotateConnector extends AbstractJavaScriptComponent<AnnotateConnectorState> {
  /* set in `modules/js/src/main/js/ui/extension/annotateExtension.js` */
  target?: Element;
  receiveStoredDocumentAnnotations?: (annotationsList: any) => void;
  receiveListCollaborators?: (collaboratorsList: Collaborator[]) => void;
  receiveAddCollaborators?: () => void;
  receiveSearchUsers?: (usersList: User[]) => void;
  receiveUserPermissions?: (...userPermissions: Permission[]) => void;
  receiveSecurityToken?: (token: string) => void;
  receiveMergeSuggestion?: (result) => void;
  receiveMergeSuggestions?: (...results) => void;
  receiveDocumentMetadata?: (metadata: string) => void;
  receiveSearchMetadata?: (metadatasets: string) => void;
  stateChangeHandler?: (state: 'OPEN' | 'CLOSE') => void;
  requestFilteredAnnotations?: () => void;
  dbg = Math.random();

  private requestDocumentMetadataCache$: ReturnType<
    AnnotateService['getDocumentsMetadata']
  >;
  private requestUserPermissionsCache$: ReturnType<
    AnnotateService['getUserPermissions']
  >;
  private requestSearchMetadataCache$: ReturnType<
    AnnotateService['fetchSearchMetadata']
  >;
  private requestSecurityTokenCache$: ReturnType<
    AnnotateService['getSecurityAnnotateToken']
  >;

  protected isEditorOpen = false;

  constructor(
    state: AnnotateConnectorInitialState,
    private options: AnnotateConnectorOptions,
    private annotateService: AnnotateService,
    private documentService: DocumentService,
    private milestoneService: ProposalMilestonesService,
    private mergeContributionService: MergeContributionsService,
    private detailsService: ProposalDetailsService,
    private dialogService: EuiDialogService,
    private translateService: TranslateService,
    private ckEditorService?: CKEditorService,
  ) {
    super({ ...leosJavaScriptExtensionState, ...state }, null);
    if (this.documentService.isEditorOpen$) {
      this.documentService.isEditorOpen$.subscribe((isOpen) => {
        this.isEditorOpen = isOpen;
      });
    }
  }

  requestStoredDocumentAnnotations(uri: string) {
    this.milestoneService.getStoredDocumentAnnotations(uri, this.dbg);
    this.milestoneService.receiveStoredDocumentAnnotations$.pipe(takeUntil(this.destroy$)).subscribe((result) => {
      if (result && result.annot && result.dbg && result.dbg == this.dbg) {
        this.receiveStoredDocumentAnnotations(result.annot);
      } else if (result && result.dbg && result.dbg == this.dbg) {
        this.receiveStoredDocumentAnnotations(null);
      }
    });
  }

  requestListCollaborators() {
    this.detailsService.listCollaborators(this.getState().proposalRef).subscribe((col) => this.receiveListCollaborators(col));
  }

  requestAddCollaborators(collaborators: Collaborator[]) {
    const collaboratorsRequest: CollaboratorRequest[] = collaborators.map(c => {
      return { userId: c.login, roleName: c.role, connectedDG: c.entity.name };
    });
    /* return this.detailsService.addCollaboratorsToProposal(this.getState().proposalRef, collaboratorsRequest)
       .pipe(switchMap(() => this.detailsService.listCollaborators(this.getState().proposalRef)))
       .subscribe((col) => this.receiveAddCollaborators(col));*/
    return this.detailsService.addCollaboratorsToProposal(this.getState().proposalRef, collaboratorsRequest).subscribe(() => this.receiveAddCollaborators());
  }

  requestSearchUsers(userId?: string) {
    if (userId && userId.length > 1) {
      this.detailsService.searchUsers(userId).subscribe((users) => this.receiveSearchUsers(users));
    } else {
      this.receiveSearchUsers([]);
    }
  }

  requestCountSentFeedbacks(annots: []) {
    this.mergeContributionService.setFeedbackToBeSent(annots.length > 0);
  }

  requestDocumentMetadata(...args) {
    if (this.requestDocumentMetadataCache$) return;
    this.requestDocumentMetadataCache$ = this.annotateService
      .getDocumentsMetadata()
      .pipe(shareReplay());
    this.clearRequestCache('requestDocumentMetadataCache$');

    this.requestDocumentMetadataCache$.pipe(delay(0)).subscribe((metadata) => {
      this.receiveDocumentMetadata(JSON.stringify(metadata));
    });
  }

  requestUserPermissions(...args) {
    if (this.requestUserPermissionsCache$) return;
    const hasFullDocumentService = !!this.documentService.permissions$;
    this.requestUserPermissionsCache$ = hasFullDocumentService
      ? this.documentService.permissions$
      : this.annotateService.getUserPermissions().pipe(shareReplay());
    this.clearRequestCache('requestUserPermissionsCache$');

    this.requestUserPermissionsCache$.pipe(delay(0)).subscribe((perms) => {
      this.receiveUserPermissions(...perms);
    });
  }

  requestMergeSuggestion(...args) {
    const mergeRequests: MergeSuggestionRequest[] = args.map(
      ({
        completeOuterHTML,
        elementId,
        endOffset,
        newText,
        origText,
        parentElementId,
        startOffset,
      }) => ({
        completeOuterHTML: completeOuterHTML as string,
        elementId: elementId as string,
        newText: newText as string,
        origText: origText as string,
        parentElementId: parentElementId as string,
        startOffset: startOffset as number,
        endOffset: endOffset as number,
      }),
    );
    if (this.isEditorOpen) {
      this.dialogService.openDialog({
        title: this.translateService.instant('page.editor.open.editor.dialog.title'),
        content: this.translateService.instant('page.editor.open.editor.dialog.body'),
        acceptLabel: this.translateService.instant('global.actions.confirm'),
        accept: () => {
          this.annotateService
            .requestMergeSuggestion(mergeRequests[0])
            .pipe(finalize(() => this.ckEditorService.saveWithConfirmation()))
            .pipe(finalize(() => this.reloadDocument()))
            .subscribe((res) => {
              this.receiveMergeSuggestion(res);
            });
        }
      });
    } else {
      this.annotateService
        .requestMergeSuggestion(mergeRequests[0])
        .pipe(finalize(() => this.reloadDocument()))
        .subscribe((res) => {
          this.receiveMergeSuggestion(res);
        });
    }
  }

  requestMergeSuggestions(...args) {
    const mergeRequests: MergeSuggestionRequest[] = args[0].map(
      ({
        completeOuterHTML,
        elementId,
        endOffset,
        newText,
        origText,
        parentElementId,
        startOffset,
      }) => ({
        completeOuterHTML: completeOuterHTML as string,
        elementId: elementId as string,
        newText: newText as string,
        origText: origText as string,
        parentElementId: parentElementId as string,
        startOffset: startOffset as number,
        endOffset: endOffset as number,
      }),
    );
    this.annotateService
      .requestMergeSuggestions(mergeRequests)
      .pipe(finalize(() => this.reloadDocument()))
      .subscribe((res) => {
        this.receiveMergeSuggestions(...res);
      });
  }

  private reloadDocument() {
    this.documentService.setDocumentRefAndCategory(
      this.documentService.documentRef,
      this.documentService.documentType,
    );
  }

  requestSearchMetadata() {
    if (this.requestSearchMetadataCache$) return;
    this.requestSearchMetadataCache$ = this.annotateService
      .fetchSearchMetadata()
      .pipe(shareReplay());
    this.clearRequestCache('requestSearchMetadataCache$');

    this.requestSearchMetadataCache$.pipe(delay(0)).subscribe((res) => {
      this.receiveSearchMetadata?.(JSON.stringify([{ status: res[0].status }]));
    });
  }

  requestSecurityToken() {
    if (this.requestSecurityTokenCache$) return;
    this.requestSecurityTokenCache$ = this.annotateService
      .getSecurityAnnotateToken()
      .pipe(shareReplay());
    this.clearRequestCache('requestSecurityTokenCache$');

    this.requestSecurityTokenCache$.pipe(delay(0)).subscribe((token) => {
      this.receiveSecurityToken?.(token);
    });
  }

  responseFilteredAnnotations(annotations: string) {
    this.options.responseFilteredAnnotations?.(annotations);
  }

  /** Forget the cached value some time after it has been completed. */
  private clearRequestCache(
    key:
      | 'requestDocumentMetadataCache$'
      | 'requestUserPermissionsCache$'
      | 'requestSearchMetadataCache$'
      | 'requestSecurityTokenCache$',
  ) {
    const observable = this[key] as Observable<any>;
    if (!observable) return;

    const clearCache = () => {
      setTimeout(() => {
        if (this[key] === observable) {
          this[key] = undefined;
        }
      }, CACHE_TIME);
    };
    observable.subscribe({
      next: clearCache,
      error: clearCache,
    });
  }
}

const leosJavaScriptExtensionState: LeosJavaScriptExtensionState = {
  callbackNames: [
    'requestDocumentMetadata',
    'requestUserPermissions',
    'requestMergeSuggestion',
    'requestMergeSuggestions',
    'requestSearchMetadata',
    'requestSecurityToken',
    'requestStoredDocumentAnnotations',
    'responseFilteredAnnotations',
  ],
  rpcInterfaces: {
    'eu.europa.ec.leos.ui.shared.js.LeosJavaScriptServerRpc': [
      'clientJSDepsInited',
    ],
  },
  jsDepsInited: true,
  dirtyTimestamp: -1,
};
