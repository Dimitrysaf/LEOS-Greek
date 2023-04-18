import { of } from 'rxjs';

/**
 * This is a stub for the DocumentService, covering the minimum functionality
 * required for the annotations in the milestone explorer.
 */
export class DocumentServiceAnnotationsStub {
  documentRef: string;
  documentType: string;
  documentView$ = of(null);

  setDocumentId(id: string) {
    this.documentRef = id;
  }

  setDocumentCategory(category: string) {
    category = category.toLowerCase();
    this.documentType = category === 'coverpage' ? 'coverPage' : category;
  }

  setAnnotationGetter() {}
}
