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
  EuiDialogComponent,
  EuiDialogService,
} from '@eui/components/eui-dialog';
import { Document, DocumentType, Permission } from '@leos/shared';
import { TranslateService } from '@ngx-translate/core';
import { Subject, takeUntil } from 'rxjs';

import { ConfirmDeleteDialogComponent } from '@/shared/components/confirm-delete-dialog/confirm-delete-dialog.component';
import { ProposalCreateDraftComponent } from '@/shared/components/proposal-create-draft/proposal-create-draft.component';
import { CoEditionVO } from '@/shared/models/coEditionVO.model';
import { CoEditionServiceWS } from '@/shared/services/coEdition.websocket.service';
import { CreateProposalService } from '@/shared/services/create-proposal.service';

import { ProposalDetailsService } from '../../services/proposal-details.service';

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
  createOptions: object;

  @ViewChild('editAnnexTitleDialog') editAnnexTitleDialog: EuiDialogComponent;
  @ViewChild('editAnnexOrder') annexOrderDialog: EuiDialogComponent;
  @ViewChild('editExplanatoryTitleDialog')
  editExplanatoryTitleDialog: EuiDialogComponent;
  explanatoryTitle: string;
  explanatoryTitleActiveId: string;
  @ViewChild('confirmationForDelete')
  confirmDeleteComp: ConfirmDeleteDialogComponent;

  @ViewChild('confirmationForDeleteExpl')
  confirmDeleteCompExpl: ConfirmDeleteDialogComponent;

  title: string;
  activeAnnexId: string;

  private destroy$: Subject<void> = new Subject();

  constructor(
    private createProposalService: CreateProposalService,
    private proposalDetailsService: ProposalDetailsService,
    private route: ActivatedRoute,
    private coEditionService: CoEditionServiceWS,
    private translate: TranslateService,
    private dialogService: EuiDialogService,
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
  }

  handleAnnexAdd() {
    if (this.proposalState !== 'loading' && this.proposalState !== 'active') {
      this.proposalStateChange.emit('active');
      this.proposalDetailsService.createAnnex();
    }
  }

  handleAnnexReorder() {
    this.annexOrderDialog.openDialog();
  }

  handleAnnexEditTitle(annex: Document) {
    this.title =
      annex.title ||
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
    const annexRef = this.annexes[event.currentIndex].id;
    //if dropped in the same position do nothing
    if (event.currentIndex === event.previousIndex) return;
    //get whether the droped element went up or down to decide the moveDirection
    let moveDirection = 'UP';
    if (event.currentIndex > event.previousIndex) {
      moveDirection = 'DOWN';
    }
    //because the backend works only for one up or one down we calculate how many times we have to repeat the function
    const timesToMove = Math.abs(event.currentIndex - event.previousIndex);
    this.proposalDetailsService.updateAnnexOrder(
      annexRef,
      moveDirection,
      timesToMove,
    );
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
      ),
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
}
