import { Component, OnInit } from '@angular/core';

import { DocumentService } from '@/shared/services/document.service';

@Component({
  selector: 'app-versions-pane',
  templateUrl: './versions-pane.component.html',
  styleUrls: ['./versions-pane.component.scss'],
})
export class VersionsPaneComponent implements OnInit {
  constructor(public doc: DocumentService) {}

  ngOnInit(): void {}
}
