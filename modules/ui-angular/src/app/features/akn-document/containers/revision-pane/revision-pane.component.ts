import { Component, OnInit } from '@angular/core';

import { DocumentService } from '@/shared/services/document.service';

@Component({
  selector: 'app-revision-pane',
  templateUrl: './revision-pane.component.html',
  styleUrls: ['./revision-pane.component.scss'],
})
export class RevisionPaneComponent implements OnInit {
  constructor(public documentService: DocumentService) {}

  ngOnInit(): void {}
}
