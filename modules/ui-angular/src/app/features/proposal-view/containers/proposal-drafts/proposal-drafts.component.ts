import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import {
  AfterViewInit,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {
  EuiDialogComponent, EuiDialogConfig,
  EuiDialogService,
} from '@eui/components/eui-dialog';
import { Document, DocumentType, Permission, LeosConfig } from '@leos/shared';
import { TranslateService } from '@ngx-translate/core';
import { Subject, takeUntil } from 'rxjs';

import { ConfirmDeleteDialogComponent } from '@/shared/components/confirm-delete-dialog/confirm-delete-dialog.component';
import { CoEditionVO } from '@/shared/models/coEditionVO.model';
import { CoEditionServiceWS } from '@/shared/services/coEdition.websocket.service';
import { CreateProposalService } from '@/shared/services/create-proposal.service';

import { ProposalDetailsService } from '../../services/proposal-details.service';
import { LoadingService } from "@/shared/services/loading.service";
import { EuiGrowlService } from "@eui/core";
import {HttpClient, HttpStatusCode} from "@angular/common/http";
import { cleanDelInsert } from '@/shared/utils/string.utils';
import {AUTONOMOUS_ACT_DOC_COLLECTION} from "@/shared/constants";
import {apiBaseUrl} from "../../../../../config";
import {downloadBlob} from "@/shared/utils";
import { AppConfigService } from '@/core/services/app-config.service';
import {ProposalAnnexUploadComponent} from "@/shared/components/proposal-annex-upload/proposal-annex-upload.component";
import {EuiFileUploadComponent} from "@eui/components/eui-file-upload";
import {getFileExtension} from '@/shared/utils/file.utils';

@Component({
  selector: 'app-proposal-drafts',
  templateUrl: './proposal-drafts.component.html',
  styleUrls: ['./proposal-drafts.component.scss'],
})
export class ProposalDraftsComponent
  implements OnInit, OnChanges, AfterViewInit, OnDestroy
{
  @Input() proposal: Document;
  @Input() proposalState: string;
  @Output() proposalStateChange: EventEmitter<string> =
    new EventEmitter<string>();
  coverpage: Document | null = null;
  explanatories: Document[] | null = null;
  memorandum: Document | null = null;
  document: Document | null = null;
  financialStatement: Document | null;
  annexes: Document[] = [];
  annexToDelete: Document = null;
  explToDelete: Document = null;
  proposalRef: string;
  coEditionMap: Record<string, CoEditionVO[]> = null;
  permissions: Permission[];
  annexCreateOption: string;
  fsCreateOption: string;
  leosConfig: LeosConfig;

  @ViewChild('editAnnexTitleDialog') editAnnexTitleDialog: EuiDialogComponent;
  @ViewChild('editAnnexOrder') annexOrderDialog: EuiDialogComponent;
  @ViewChild('editExplanatoryTitleDialog')
  editExplanatoryTitleDialog: EuiDialogComponent;
  explanatoryTitle: string;
  explanatoryTitleActiveId: string;
  @ViewChild('confirmationForDelete')
  confirmDeleteComp: ConfirmDeleteDialogComponent;
  @ViewChild('uploadFile') uploadEuiFile: EuiFileUploadComponent;

  @ViewChild('confirmationForDeleteExpl')
  confirmDeleteCompExpl: ConfirmDeleteDialogComponent;

  title: string;
  activeAnnexId: string;
  AUTONOMOUS_ACT_DOC_COLLECTION: string = AUTONOMOUS_ACT_DOC_COLLECTION;
  canAddDeleteAnnex: boolean = true;
  linguisticVersionAlignment: boolean = false;

  private destroy$: Subject<void> = new Subject();

  getFileExtension = getFileExtension;

  constructor(
    private createProposalService: CreateProposalService,
    private proposalDetailsService: ProposalDetailsService,
    private route: ActivatedRoute,
    private coEditionService: CoEditionServiceWS,
    private translate: TranslateService,
    private dialogService: EuiDialogService,
    private loadingService: LoadingService,
    private growlService: EuiGrowlService,
    private translateService: TranslateService,
    private http: HttpClient,
    private appConfigService: AppConfigService,
  ) {}

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  ngAfterViewInit(): void {
    this.coEditionService.allCoEditionInfo.pipe().subscribe((c) => {
      this.coEditionMap = c;
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if ('proposal' in changes) {
      this.populateView();
    }
  }

  ngOnInit() {
    // FIXME: Validate document selection method
    this.route.params.pipe().subscribe((params) => {
      this.proposalRef = params['proposalId'];
    });
    this.populateView();
    this.coEditionService.joinDocumentChannel();
    this.proposalDetailsService.permissions$
      .pipe(takeUntil(this.destroy$))
      .subscribe((perms) => {
        this.permissions = perms;
      });
    this.appConfigService.config
      .pipe(takeUntil(this.destroy$))
      .subscribe((config) => {
        this.leosConfig = config;
      });
    this.linguisticVersionAlignment = this.proposal.metadata.customTemplateAct || this.proposal.metadata.fromCustomTemplate;
    this.canAddDeleteAnnex = !this.linguisticVersionAlignment || !this.proposalDetailsService.getTranslated();
  }

  handleAnnexAdd() {
    if (this.proposalState !== 'loading' && this.proposalState !== 'active') {
      this.proposalStateChange.emit('active');
      this.proposalDetailsService.createAnnex();
    }
  }

  handleAnnexUploadRenditionPopup(annex?: Document) {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.pdf';
    input.onchange = (event: any) => {
      const file = event.target.files[0];
      if (file.size > (50 * 1024 * 1024)) {
        this.loadingService.setLoading(false);
        this.dialogService.openDialog({
          title: this.translateService.instant('page.collection.drafts.annex.max.size.error.title'),
          content: this.translateService.instant('page.collection.drafts.annex.max.size.error.message'),
          hasDismissButton: false,
        });
        this.growlService.clearGrowl();
        return;
      }
      if (this.proposalState !== 'loading' && this.proposalState !== 'active') {
        this.proposalStateChange.emit('active');
      }
      this.proposalDetailsService.uploadAnnexRendition(annex.id, file);
    };
    input.click();
  }

  handleAnnexUploadPopup(annex?: Document) {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.docx, .xlsx, .pdf';
    input.onchange = (event: any) => {
      const file = event.target.files[0];
      if (file.size > (50 * 1024 * 1024)) {
        this.loadingService.setLoading(false);
        this.dialogService.openDialog({
          title: this.translateService.instant('page.collection.drafts.annex.max.size.error.title'),
          content: this.translateService.instant('page.collection.drafts.annex.max.size.error.message'),
          hasDismissButton: false,
        });
        this.growlService.clearGrowl();
        return;
      }
      if (this.proposalState !== 'loading' && this.proposalState !== 'active') {
        this.proposalStateChange.emit('active');
      }
      if (file && !annex) {
        let annexWithSameName = this.proposal?.childDocuments?.find(e => e.category === 'BILL')?.childDocuments?.find(e => e.category === 'ANNEX' && e.originalFilename?.toUpperCase().trim() === file.name?.toUpperCase().trim());
        if (annexWithSameName) {
          const dialog = this.dialogService.openDialog(
            new EuiDialogConfig({
              dialogId: 'proposa-annex-upload',
              title: this.translateService.instant('page.collection.drafts.annex.same.name.error.title'),
              bodyComponent: {
                component: ProposalAnnexUploadComponent,
                config: {
                  closeDialog: () => {
                    this.dialogService.closeDialog(dialog.id);
                    this.proposalDetailsService.setProposalRef(this.proposalRef);
                  },
                  annexId: annexWithSameName.id,
                  file: file,
                  childDocuments: this.proposal?.childDocuments,
                  stateChanged: this.proposalStateChange
                },
              },
              hasCloseButton: false,
              hasFooter: false,
              escape: () => {
                this.dialogService.closeDialog(dialog.id);
                this.proposalDetailsService.setProposalRef(this.proposalRef);
              },
            })
          );
        } else {
          this.proposalDetailsService.createForeignAnnex(file);
        }
      } else if (file && annex) {
        this.proposalDetailsService.updateForeignAnnex(annex.id, file);
      }
    };
    input.click();
  }

  handleAnnexReorder() {
    this.annexOrderDialog.openDialog();
  }

  handleAnnexEditTitle(annex: Document) {
    this.title =
      cleanDelInsert(annex.title) ||
      this.translate.instant('page.collection.drafts.annex.table.tr.no-title');
    this.activeAnnexId = annex.id;
    this.editAnnexTitleDialog.openDialog();
  }

  handleAnnexDelete(annex: Document) {
    this.annexToDelete = annex;
    this.confirmDeleteComp.deleteDialog.openDialog();
  }

  handleConfirmationDelete() {
    if (!this.annexToDelete) {
      this.proposalStateChange.emit('done');
      return;
    }
    if (this.proposalState !== 'loading' && this.proposalState !== 'active') {
      this.proposalStateChange.emit('active');
      this.proposalDetailsService.deleteAnnex(
        this.annexToDelete.metadata.internalRef,
      );
      this.annexToDelete = null;
    }
  }

  handleConfirmationDeleteExpl(expl: Document) {
    this.explToDelete = expl;
    this.confirmDeleteCompExpl.deleteDialog.openDialog();
  }

  handleExplanatoryEditTitle({ title, id }: Document) {
    this.explanatoryTitle = title;
    this.explanatoryTitleActiveId = id;
    this.editExplanatoryTitleDialog.openDialog();
  }

  handleExplanatoryTitleSave() {
    this.editExplanatoryTitleDialog.closeDialog();
    this.proposalDetailsService.updateExplanatoryTitle(
      this.explanatoryTitleActiveId,
      this.explanatoryTitle,
    );
  }

  handleSave() {
    this.proposalStateChange.emit('done');
    this.editAnnexTitleDialog.closeDialog();
    this.proposalDetailsService.updateAnnexTitle(
      this.activeAnnexId,
      this.title,
    );
  }

  handleCreateDraft() {
    this.createProposalService.openProposalCreateDraftDialog(true);
  }

  drop(event: CdkDragDrop<any[]>) {
    moveItemInArray(this.annexes, event.previousIndex, event.currentIndex);
    //if dropped in the same position do nothing
    if (event.currentIndex === event.previousIndex) return;
    this.proposalDetailsService.updateAnnexOrder(
      event.previousIndex + 1,
      event.currentIndex + 1,
    ).subscribe({
      next: () => this.proposalDetailsService.setProposalRef(this.proposalRef),
      error: (res) => {
        moveItemInArray(this.annexes, event.currentIndex, event.previousIndex);
        if (res.status === HttpStatusCode.TooManyRequests) {
          this.growlService.growl({
            severity: 'warning',
            summary: this.translateService.instant(
              'global.notifications.title.warning',
            ),
            detail: this.translateService.instant(
              'page.collection.drafts.annex.reorder-dialog.warning.concurrency',
            ),
            life: 5000,
            isGrowlSticky: false,
            position: 'bottom-right',
          });
        } else {
          this.growlService.growl({
            severity: 'danger',
            summary: this.translateService.instant(
              'global.notifications.title.error',
            ),
            detail: this.translateService.instant(
              'page.collection.drafts.annex.reorder-dialog.error',
            ),
            life: 5000,
            isGrowlSticky: false,
            position: 'bottom-right',
          });
        }
        this.proposalDetailsService.setProposalRef(this.proposalRef);
      },
    });
  }

  handleExplanatoryDelete() {
    this.proposalDetailsService
      .deleteExplanatory(this.explToDelete.metadata.internalRef)
      .subscribe((res) => {
        this.explanatories = this.explanatories.filter(
          (d) => d.id !== this.explToDelete.id,
        );
        this.explToDelete = null;
      });
  }

  downloadForeignAnnex(ref: string, originalFilename: string) {
    this.loadingService.setLoading(true);
    this.http
      .get(`${apiBaseUrl}/secured/annex/${ref}`, {
        responseType: 'blob',
      })
      .subscribe({
        next: (blob) => downloadBlob(blob, `${originalFilename}`),
        complete: () => this.loadingService.setLoading(false),
      });
  }

  downloadForeignAnnexRendition(ref: string, foreignRenditionOriginalFilename: string) {
    this.loadingService.setLoading(true);
    this.http
      .get(`${apiBaseUrl}/secured/annex/${ref}/rendition`, {
        responseType: 'blob',
      })
      .subscribe({
        next: (blob) => downloadBlob(blob, `${foreignRenditionOriginalFilename}`),
        complete: () => this.loadingService.setLoading(false),
      });
  }

  onFinancialStatementCreate() {
    this.proposalDetailsService.createFinancialStatement();
  }

  onFinancialStatementDelete() {
    this.dialogService.openDialog({
      title: this.translate.instant(
        'page.collection.drafts.financial-statement.delete.confirm-dialog.title',
      ),
      content: this.translate.instant(
        'page.collection.drafts.financial-statement.delete.confirm-dialog.body',
      ) + (this.fsCreateOption === 'DEFAULT_TRUE' ? '<br/>' + this.translate.instant(
        'page.collection.drafts.financial-statement.delete.confirm-dialog.justification',
      ): ""),
      acceptLabel: this.translate.instant('global.actions.delete'),
      accept: () => {
        this.proposalDetailsService.deleteFinancialStatement(
          this.financialStatement.metadata.internalRef,
        );
      },
    });
  }

  private populateView() {
    const getChildDocument = (type: DocumentType) =>
      this.proposal.childDocuments.find((d) => d.category === type) ?? null;
    this.setCreateOptions();
    this.coverpage = getChildDocument('COVERPAGE');
    this.memorandum = getChildDocument('MEMORANDUM');
    this.document = getChildDocument('BILL');
    this.explanatories = this.proposal.childDocuments.filter(
      (d) => d.category === 'COUNCIL_EXPLANATORY',
    );
    this.financialStatement = getChildDocument('STAT_DIGIT_FINANC_LEGIS');
    this.annexes =
      this.document?.childDocuments.filter((d) => d.category === 'ANNEX') ??
      null;
  }

  private setCreateOptions() {
    const createOptions = JSON.parse(this.proposal.creationOptions);
    const createOptionsKeys = Object.keys(createOptions);
    const fsKey = createOptionsKeys.find(key => key.startsWith('FS-001'));
    const annexKey = createOptionsKeys.find(key => key.startsWith('SG-017') || key.startsWith('SG-068'));
    this.fsCreateOption = createOptions[fsKey];
    this.annexCreateOption = createOptions[annexKey];
  }
   protected readonly cleanDelInsert = cleanDelInsert;
}
