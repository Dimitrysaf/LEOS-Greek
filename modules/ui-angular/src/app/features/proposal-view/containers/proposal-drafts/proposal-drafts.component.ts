import { Component, Input, OnInit } from '@angular/core';
import { Document, DocumentType } from '@leos/shared';

@Component({
  selector: 'app-proposal-drafts',
  templateUrl: './proposal-drafts.component.html',
  styleUrls: ['./proposal-drafts.component.scss'],
})
export class ProposalDraftsComponent implements OnInit {
  @Input() proposal: Document;
  coverpage: Document | null = null;
  memorandum: Document | null = null;
  document: Document | null = null;
  annexes: Document[] = [];

  constructor() {}

  ngOnInit() {
    // FIXME: Validate document selection method
    const getChildDocument = (type: DocumentType) =>
      this.proposal.childDocuments.find((d) => d.category === type) ?? null;

    this.coverpage = getChildDocument('COVERPAGE');
    this.memorandum = getChildDocument('MEMORANDUM');
    this.document = getChildDocument('BILL');
    this.annexes = this.document.childDocuments.filter(
      (d) => d.category === 'ANNEX',
    );
    // TODO : more types?
    // + PROPOSAL
    // + COVERPAGE;
    // + MEMORANDUM
    // + BILL
    // + ANNEX
    // - COUNCIL_EXPLANATORY
    // - MEDIA
    // - CONFIG
    // - LEG
    // - STRUCTURE
    // - EXPORT
  }

  handleAnnexAdd() {
    console.warn('stub:', 'handleAnnexAdd'); // FIXME
  }

  handleAnnexReorder() {
    console.warn('stub:', 'handleAnnexReorder'); // FIXME
  }

  handleAnnexEditTitle(annex: Document) {
    console.warn('stub:', 'handleAnnexEditTitle', annex); // FIXME
  }

  handleAnnexDelete(annex: Document) {
    console.warn('stub:', 'handleAnnexDelete', annex); // FIXME
  }
}
