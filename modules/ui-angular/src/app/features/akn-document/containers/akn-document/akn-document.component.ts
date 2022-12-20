import { Component, OnInit } from '@angular/core';

import { DocumentService } from '@/features/akn-document/services/document.service';

@Component({
  selector: 'app-akn-document',
  templateUrl: './akn-document.component.html',
  styleUrls: ['./akn-document.component.scss'],
})
export class AknDocumentComponent implements OnInit {
  xml: string;
  constructor(private documentService: DocumentService) {}

  ngOnInit(): void {
    this.documentService.getXmlDocument().subscribe((data) => {
      console.log(typeof data === 'string');
      this.xml = data;
      console.log('XML => ', this.xml);
    });
  }
}
