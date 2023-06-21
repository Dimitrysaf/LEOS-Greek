import { Component, Input, OnInit } from '@angular/core';

import { ContributionVO } from '@/shared/models/contribution-vo.model';
import { DocumentService } from '@/shared/services/document.service';

@Component({
  selector: 'app-revision-actions-dropdown',
  templateUrl: './revision-actions-dropdown.component.html',
  styleUrls: ['./revision-actions-dropdown.component.scss'],
})
export class RevisionActionsDropdownComponent implements OnInit {
  @Input() contribution: ContributionVO;
  constructor(public documentService: DocumentService) {}

  ngOnInit(): void {}
}
