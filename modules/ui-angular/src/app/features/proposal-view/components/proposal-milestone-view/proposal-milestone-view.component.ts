import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EuiDialogComponent } from '@eui/components/eui-dialog';

import { Document } from '@/shared';

@Component({
  selector: 'app-proposal-milestone-view',
  templateUrl: './proposal-milestone-view.component.html',
  styleUrls: ['./proposal-milestone-view.component.scss'],
})
export class ProposalMilestoneViewComponent implements OnInit {
  @Input() proposal: Document;
  proposalRef: string;
  documents: Document[] = [];
  annexDocs: Document[] = [];

  @ViewChild('milestoneView') milestoneView: EuiDialogComponent;
  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.proposalRef = params['proposalId'];
    });
    for (const doc of this.proposal.childDocuments) {
      // if (doc.category === 'COUNCIL_EXPLANATORY') {
      //   return;
      // }
      if (doc.category === 'BILL') {
        for (const anenx of doc.childDocuments) {
          this.annexDocs.push(anenx);
        }
      }
      if (doc.category) this.documents.push(doc);
      //TODO : FIX THESE FROM THE BE
      if (doc.category === 'COVERPAGE') {
        doc.metadata.internalRef = this.proposalRef;
      }
    }
    this.documents = this.documents.concat(this.annexDocs);
  }

  openDialog() {
    this.milestoneView.openDialog();
  }

  getDocumentsForMilestoneView() {
    return this.documents.filter(
      (d) => !['COUNCIL_EXPLANATORY', 'COVERPAGE'].includes(d.category),
    );
  }

  getDocTitle(doc: Document) {
    switch (doc.documentType) {
      case 'ANNEX':
        return doc.title;
      case 'MEMORANDUM':
        return 'Explanatory Memorandum';
      case 'BILL':
        return 'Legal Act';
      case 'COVERPAGE':
        return 'Cover Page';
      default:
        return doc.title;
    }
  }
}
