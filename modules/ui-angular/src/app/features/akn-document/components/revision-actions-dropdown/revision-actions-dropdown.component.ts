import { Component, OnInit } from '@angular/core';

import { DocumentService } from '@/shared/services/document.service';

@Component({
  selector: 'app-revision-actions-dropdown',
  templateUrl: './revision-actions-dropdown.component.html',
  styleUrls: ['./revision-actions-dropdown.component.scss'],
})
export class RevisionActionsDropdownComponent implements OnInit {
  constructor(public documentService: DocumentService) {}

  ngOnInit(): void {}
}
