import {Injectable} from '@angular/core';
import {Subject} from 'rxjs';
import {HttpClient} from "@angular/common/http";
import {TableOfContentService} from "@/features/akn-document/services/table-of-content.service";
import {CoEditionServiceWS} from "@/shared/services/coEdition.websocket.service";
import {BlockDocumentEditorService} from "@/features/akn-document/services/block-document-editor.service";
import {apiBaseUrl} from "../../../../config";
import {DocumentService} from "@/shared/services/document.service";
import {DocumentViewResponse} from "@/shared/models/document-view-response.model";
import {LEOS_TC_DELETE_ACTION, LEOS_TC_INSERT_ACTION} from "@/shared/constants";

export enum TrackChangeAction {
  ADD,
  DEL,
  MOVED_TO,
  MOVED_FROM
}

@Injectable()
export class TrackChangesActionsService{
  public LEOS_UID_ATTR = "leos\\:uid";
  public LEOS_SOFT_ACTION_ROOT = "leos\\:action";
  private ALLOWED_TAGS = ["article", "citation", "recital", ":not(article) paragraph", "level", "chapter", "akntitle", "part", "section"];
  private selector: string;

  public show:Subject<{trackChanges: NodeListOf<HTMLElement>}> = new Subject<{trackChanges: NodeListOf<HTMLElement>}>();

  constructor(
    private http: HttpClient,
    private tableOfContentService: TableOfContentService,
    private coEditionService: CoEditionServiceWS,
    private blockDocumentEditorService: BlockDocumentEditorService,
  ) {
    this.selector = '';
    for (let i = 0; i < this.ALLOWED_TAGS.length; i++) {
      let allowedTag = this.ALLOWED_TAGS[i];
      this.selector += allowedTag + '[' + this.LEOS_UID_ATTR + '][' + this.LEOS_SOFT_ACTION_ROOT + ']';
      if (i < this.ALLOWED_TAGS.length-1) {
        this.selector += ', ';
      }
    }
  }

  getSelector() {
    return this.selector;
  }

  applyTrackChangeAction(trackChangeAction: TrackChangeAction, elementData: {elementType: string, elementId: string}, docService: DocumentService) {
    let elementType = elementData.elementType == 'akntitle' ? 'title' : elementData.elementType;
    switch (trackChangeAction) {
      case TrackChangeAction.DEL:
        this.acceptChangeElement({elementId: elementData.elementId, elementType: elementType}, LEOS_TC_DELETE_ACTION, docService);
        break;
      case TrackChangeAction.ADD:
        this.acceptChangeElement({elementId: elementData.elementId, elementType: elementType}, LEOS_TC_INSERT_ACTION, docService);
        break;
      case TrackChangeAction.MOVED_TO:
        this.acceptChangeElement({elementId: elementData.elementId, elementType: elementType}, 'move_to', docService);
        break;
      case TrackChangeAction.MOVED_FROM:
        this.acceptChangeElement({elementId: elementData.elementId, elementType: elementType}, 'move_from', docService);
        break;
    }
  }

  rejectTrackChangeAction(trackChangeAction: TrackChangeAction, elementData: {elementType: string, elementId: string}, docService: DocumentService) {
    let elementType = elementData.elementType == 'akntitle' ? 'title' : elementData.elementType;
    switch (trackChangeAction) {
      case TrackChangeAction.DEL:
        this.rejectChangeElement({elementId: elementData.elementId, elementType: elementType}, LEOS_TC_DELETE_ACTION, docService);
        break;
      case TrackChangeAction.ADD:
        this.rejectChangeElement({elementId: elementData.elementId, elementType: elementType}, LEOS_TC_INSERT_ACTION, docService);
        break;
      case TrackChangeAction.MOVED_TO:
        this.rejectChangeElement({elementId: elementData.elementId, elementType: elementType}, 'move_to', docService);
        break;
      case TrackChangeAction.MOVED_FROM:
        this.rejectChangeElement({elementId: elementData.elementId, elementType: elementType}, 'move_from', docService);
        break;
    }
  }

  private acceptChangeElement(elemData: {
    elementId: string;
    elementType: string;
  }, trackChangeAction: string, docService: DocumentService) {
    this.blockDocumentEditorService.setIsDocumentEditorBlocked(true);
    docService.setDidDocumentLoadAndRender(false);
    const documentRef = docService.documentRef;
    const documentType = docService.documentType;
    this.acceptChangeForDocumentElement(
      documentRef,
      elemData.elementId,
      elemData.elementType,
      documentType,
      trackChangeAction,
    ).subscribe((response) => {
      this.tableOfContentService.reload();
      this.coEditionService.sendUpdateDocumentEvent(documentRef);
      docService.reloadDocument();
      this.blockDocumentEditorService.setIsDocumentEditorBlocked(false);
    });
  }

  private rejectChangeElement(elemData: {
    elementId: string;
    elementType: string;
  }, trackChangeAction: string, docService: DocumentService) {
    this.blockDocumentEditorService.setIsDocumentEditorBlocked(true);
    docService.setDidDocumentLoadAndRender(false);
    const documentRef = docService.documentRef;
    const documentType = docService.documentType;
    this.rejectChangeForDocumentElement(
      documentRef,
      elemData.elementId,
      elemData.elementType,
      documentType,
      trackChangeAction,
    ).subscribe((response) => {
      this.tableOfContentService.reload();
      this.coEditionService.sendUpdateDocumentEvent(documentRef);
      docService.reloadDocument();
      this.blockDocumentEditorService.setIsDocumentEditorBlocked(false);
    });
  }

  private acceptChangeForDocumentElement(
    documentRef: string,
    elementId: string,
    elementType: string,
    documentType: string,
    trackChangeAction: string,
  ) {
    return this.http.get<DocumentViewResponse>(
      `${apiBaseUrl}/secured/${documentType}/${documentRef}/accept-change/${elementId}/${elementType}?trackChangeAction=${trackChangeAction}`,
      { headers: { 'Content-Type': 'text/plain; charset=utf-8' } },
    );
  }

  private rejectChangeForDocumentElement(
    documentRef: string,
    elementId: string,
    elementType: string,
    documentType: string,
    trackChangeAction: string,
  ) {
    return this.http.get<DocumentViewResponse>(
      `${apiBaseUrl}/secured/${documentType}/${documentRef}/reject-change/${elementId}/${elementType}?trackChangeAction=${trackChangeAction}`,
      { headers: { 'Content-Type': 'text/plain; charset=utf-8' } },
    );
  }
}
