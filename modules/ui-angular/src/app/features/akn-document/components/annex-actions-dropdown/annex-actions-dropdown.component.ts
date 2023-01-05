import { Component } from '@angular/core';

import { DocumentService } from '@/features/akn-document/services/document.service';

@Component({
  selector: 'app-annex-actions-dropdown',
  templateUrl: './annex-actions-dropdown.component.html',
  styleUrls: ['./annex-actions-dropdown.component.scss'],
})
export class AnnexActionsDropdownComponent {
  constructor(public doc: DocumentService) {}
}
