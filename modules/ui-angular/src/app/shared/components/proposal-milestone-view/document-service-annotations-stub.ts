import { of } from 'rxjs';

import { AnnotateOperationMode } from '@/shared';

/**
 * This is a stub for the DocumentService, covering the minimum functionality
 * required for the annotations in the milestone explorer.
 */
export class DocumentServiceAnnotationsStub {
  documentRef: string;
  documentType: string;
  documentView$ = of(null);
  setAnnotationMode?: (mode: AnnotateOperationMode) => void;

  setDocumentId(id: string) {
    this.documentRef = id;
  }

  setDocumentCategory(category: string) {
    category = category.toLowerCase();
    this.documentType = category === 'coverpage' ? 'coverPage' : category;
  }

  setAnnotationGetter() {}

  setDocumentRefAndCategory(ref: string, category: string) {
    this.documentRef = ref;
    this.documentType = category;
  }

  setAnnotationsReadOnlySetter(
    setAnnotationsReadOnly: (mode: AnnotateOperationMode) => void,
  ) {
    this.setAnnotationMode = setAnnotationsReadOnly;
  }
}
