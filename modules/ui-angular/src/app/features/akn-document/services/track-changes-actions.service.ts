import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

import { BlockDocumentEditorService } from '@/features/akn-document/services/block-document-editor.service';
import {
  LEOS_TC_DELETE_ACTION,
  LEOS_TC_INSERT_ACTION,
} from '@/shared/constants';
import { DocumentViewResponse } from '@/shared/models/document-view-response.model';
import { CoEditionServiceWS } from '@/shared/services/coEdition.websocket.service';
import { DocumentService } from '@/shared/services/document.service';

import { apiBaseUrl } from '../../../../config';

export enum TrackChangeAction {
  ADD,
  DEL,
  MOVED_TO,
  MOVED_FROM,
}

@Injectable()
export class TrackChangesActionsService {
  public LEOS_UID_ATTR = 'leos\\:uid';
  public LEOS_TRACK_ACTION = 'leos\\:action';
  public LEOS_SOFT_ACTION = 'leos\\:softaction';
  public MOVE_FROM = 'move_from';
  public show: Subject<{ trackChanges: NodeListOf<HTMLElement> }> =
    new Subject<{ trackChanges: NodeListOf<HTMLElement> }>();

  private ALLOWED_TAGS = [
    'article',
    'citation',
    'recital',
    ':not(article) paragraph',
    'level',
    'chapter',
    'akntitle',
    'part',
    'section',
  ];
  private selector: string;

  constructor(
    private http: HttpClient,
    private coEditionService: CoEditionServiceWS,
    private blockDocumentEditorService: BlockDocumentEditorService,
  ) {
    this.selector = '';
    for (let i = 0; i < this.ALLOWED_TAGS.length; i++) {
      const allowedTag = this.ALLOWED_TAGS[i];
      this.selector +=
        allowedTag +
        '[' +
        this.LEOS_UID_ATTR +
        '][' +
        this.LEOS_TRACK_ACTION +
        '], ' +
        allowedTag +
        '[' +
        this.LEOS_SOFT_ACTION +
        '=' +
        this.MOVE_FROM +
        ']';
      if (i < this.ALLOWED_TAGS.length - 1) {
        this.selector += ', ';
      }
    }
  }

  getSelector() {
    return this.selector;
  }

  applyTrackChangeAction(
    trackChangeAction: TrackChangeAction,
    elementData: { elementType: string; elementId: string },
    docService: DocumentService,
  ) {
    const elementType =
      elementData.elementType === 'akntitle'
        ? 'title'
        : elementData.elementType;
    switch (trackChangeAction) {
      case TrackChangeAction.DEL:
        this.acceptChangeElement(
          { elementId: elementData.elementId, elementType },
          LEOS_TC_DELETE_ACTION,
          docService,
        );
        break;
      case TrackChangeAction.ADD:
        this.acceptChangeElement(
          { elementId: elementData.elementId, elementType },
          LEOS_TC_INSERT_ACTION,
          docService,
        );
        break;
      case TrackChangeAction.MOVED_TO:
        this.acceptChangeElement(
          { elementId: elementData.elementId, elementType },
          'move_to',
          docService,
        );
        break;
      case TrackChangeAction.MOVED_FROM:
        this.acceptChangeElement(
          { elementId: elementData.elementId, elementType },
          'move_from',
          docService,
        );
        break;
    }
  }

  rejectTrackChangeAction(
    trackChangeAction: TrackChangeAction,
    elementData: { elementType: string; elementId: string },
    docService: DocumentService,
  ) {
    const elementType =
      elementData.elementType === 'akntitle'
        ? 'title'
        : elementData.elementType;
    switch (trackChangeAction) {
      case TrackChangeAction.DEL:
        this.rejectChangeElement(
          { elementId: elementData.elementId, elementType },
          LEOS_TC_DELETE_ACTION,
          docService,
        );
        break;
      case TrackChangeAction.ADD:
        this.rejectChangeElement(
          { elementId: elementData.elementId, elementType },
          LEOS_TC_INSERT_ACTION,
          docService,
        );
        break;
      case TrackChangeAction.MOVED_TO:
        this.rejectChangeElement(
          { elementId: elementData.elementId, elementType },
          'move_to',
          docService,
        );
        break;
      case TrackChangeAction.MOVED_FROM:
        this.rejectChangeElement(
          { elementId: elementData.elementId, elementType },
          'move_from',
          docService,
        );
        break;
    }
  }

  private acceptChangeElement(
    elemData: {
      elementId: string;
      elementType: string;
    },
    trackChangeAction: string,
    docService: DocumentService,
  ) {
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
      docService.refreshView(response);
      this.blockDocumentEditorService.setIsDocumentEditorBlocked(false);
    });
  }

  private rejectChangeElement(
    elemData: {
      elementId: string;
      elementType: string;
    },
    trackChangeAction: string,
    docService: DocumentService,
  ) {
    docService.setDidDocumentLoadAndRender(false);
    this.blockDocumentEditorService.setIsDocumentEditorBlocked(true);
    const documentRef = docService.documentRef;
    const documentType = docService.documentType;
    this.rejectChangeForDocumentElement(
      documentRef,
      elemData.elementId,
      elemData.elementType,
      documentType,
      trackChangeAction,
    ).subscribe((response) => {
      docService.refreshView(response);
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
    const presenterId = this.coEditionService.presenterId;
    return this.http.get<DocumentViewResponse>(
      `${apiBaseUrl}/secured/${documentType}/${documentRef}/accept-change/${elementId}/${elementType}?trackChangeAction=${trackChangeAction}`,
      { headers: { 'Content-Type': 'text/plain; charset=utf-8', presenterId } },
    );
  }

  private rejectChangeForDocumentElement(
    documentRef: string,
    elementId: string,
    elementType: string,
    documentType: string,
    trackChangeAction: string,
  ) {
    const presenterId = this.coEditionService.presenterId;
    return this.http.get<DocumentViewResponse>(
      `${apiBaseUrl}/secured/${documentType}/${documentRef}/reject-change/${elementId}/${elementType}?trackChangeAction=${trackChangeAction}`,
      { headers: { 'Content-Type': 'text/plain; charset=utf-8', presenterId } },
    );
  }
}
