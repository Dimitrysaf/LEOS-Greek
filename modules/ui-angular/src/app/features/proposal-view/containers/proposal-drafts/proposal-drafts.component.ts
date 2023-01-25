import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { EuiDialogComponent } from '@eui/components/eui-dialog';
import { Document, DocumentType } from '@leos/shared';

import { ProposalDetailsService } from '../../services/proposal-details.service';

@Component({
  selector: 'app-proposal-drafts',
  templateUrl: './proposal-drafts.component.html',
  styleUrls: ['./proposal-drafts.component.scss'],
})
export class ProposalDraftsComponent implements OnInit, OnChanges {
  @Input() proposal: Document;
  coverpage: Document | null = null;
  memorandum: Document | null = null;
  document: Document | null = null;
  annexes: Document[] = [];

  @ViewChild('editTitle') dialog: EuiDialogComponent;
  @ViewChild('editAnnexOrder') annexOrderDialog: EuiDialogComponent;

  title: string;
  activeAnnexId: string;

  constructor(private proposalDetailsService: ProposalDetailsService) {}
  ngOnChanges(changes: SimpleChanges): void {
    if ('proposal' in changes) {
      this.populateView();
    }
  }

  ngOnInit() {
    // FIXME: Validate document selection method
    this.populateView();
  }

  handleAnnexAdd() {
    this.proposalDetailsService.createAnnex();
  }

  handleAnnexReorder() {
    this.annexOrderDialog.openDialog();
  }

  handleAnnexEditTitle(annex: Document) {
    this.title = annex.title;
    this.activeAnnexId = annex.id;
    this.dialog.openDialog();
  }

  handleAnnexDelete(annex: Document) {
    this.proposalDetailsService.deleteAnnex(annex.metadata.internalRef);
  }

  handleSave() {
    this.dialog.closeDialog();
    this.proposalDetailsService.updateAnnexTitle(
      this.activeAnnexId,
      this.title,
    );
  }
  handleClose() {
    this.dialog.closeDialog();
  }

  drop(event: CdkDragDrop<any[]>) {
    moveItemInArray(this.annexes, event.previousIndex, event.currentIndex);
    const annexRef = this.annexes[event.currentIndex].id;
    //if droped in the same position do nothing
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

  private populateView() {
    const getChildDocument = (type: DocumentType) =>
      this.proposal.childDocuments.find((d) => d.category === type) ?? null;

    this.coverpage = getChildDocument('COVERPAGE');
    this.memorandum = getChildDocument('MEMORANDUM');
    this.document = getChildDocument('BILL');
    this.annexes = this.document.childDocuments.filter(
      (d) => d.category === 'ANNEX',
    );
  }
}
