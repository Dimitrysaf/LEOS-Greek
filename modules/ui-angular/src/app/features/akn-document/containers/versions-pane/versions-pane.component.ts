import { Component, EventEmitter, OnInit, Output } from '@angular/core';

import { Version } from '@/features/akn-document/models';
import { DocumentService } from '@/shared/services/document.service';

@Component({
  selector: 'app-versions-pane',
  templateUrl: './versions-pane.component.html',
  styleUrls: ['./versions-pane.component.scss'],
})
export class VersionsPaneComponent implements OnInit {
  @Output() exploreMilestone = new EventEmitter<Version>();

  constructor(public doc: DocumentService) {}

  ngOnInit(): void {}
}
