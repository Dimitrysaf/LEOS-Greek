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
    console.warn('stub:', 'handleAnnexReorder'); // FIXME
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
