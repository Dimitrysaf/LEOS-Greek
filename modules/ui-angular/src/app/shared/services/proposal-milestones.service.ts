import { DOCUMENT } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { parse as parseContentDisposition } from 'content-disposition-attachment';
import {BehaviorSubject, Observable, Subject} from 'rxjs';
import { apiBaseUrl } from 'src/config';

import type { MilestoneViewResponse } from '@/features/proposal-view/models/milestone.model';
import { LoadingService } from '@/shared/services/loading.service';
import { downloadBlob } from '@/shared/utils';

@Injectable({
  providedIn: 'root',
})
export class ProposalMilestonesService {
  readyToMergeStatus$: Observable<string>;
  requestStoredDocumentAnnotations$: Observable<{uri: string, dbg: number}>;
  receiveStoredDocumentAnnotations$: Observable<{annot: string, dbg: number}>;

  private requestStoredDocumentAnnotations = new Subject<{uri: string, dbg: number}>();
  private receiveStoredDocumentAnnotations = new Subject<{annot: string, dbg: number}>();
  private readyToMergeStatusSource = new BehaviorSubject<string>('');

  constructor(
    private http: HttpClient,
    private loadingService: LoadingService,
    @Inject(DOCUMENT) private document: Document,
  ) {
    this.readyToMergeStatus$ = this.readyToMergeStatusSource.asObservable();
    this.requestStoredDocumentAnnotations$ =
      this.requestStoredDocumentAnnotations.asObservable();
    this.receiveStoredDocumentAnnotations$ =
      this.receiveStoredDocumentAnnotations.asObservable();
  }

  listMilestoneView(proposalRef: string, legFileName: string, legFileId: string) {
    return this.http.get<MilestoneViewResponse>(
      `${apiBaseUrl}/secured/list-milestones-view/${proposalRef}`,
      {
        params: { legFileName, legFileId },
      },
    );
  }

  listMilestoneViewFromVersion(
    proposalRef: string,
    versionedReference: string,
  ) {
    return this.http.get<MilestoneViewResponse>(
      `${apiBaseUrl}/secured/list-milestones-view-version/${proposalRef}`,
      {
        params: { versionedReference },
      },
    );
  }

  listContributionsView(proposalRef: string, legFileName: string, legFileId: string) {
    return this.http.get<MilestoneViewResponse>(
      `${apiBaseUrl}/secured/contribution/milestones/${proposalRef}/viewContribution/${legFileName}?legFileId=${legFileId}`,
    );
  }

  getStoredDocumentAnnotations(uri: string, dbg: number) {
    this.requestStoredDocumentAnnotations.next({uri, dbg});
  }

  sendRequestStoredDocumentAnnotations(
    proposalRef: string,
    legFileId: string,
    documentRef: string,
    removeRevisionPrefix: boolean,
    dbg
  ) {
    return this.http
      .get<string>(
        `${apiBaseUrl}/secured/document/${proposalRef}/stored-annotations/${documentRef}?legFileId=${legFileId}&removeRevisionPrefix=${removeRevisionPrefix}`,
      )
      .subscribe((response) => {
        this.receiveStoredDocumentAnnotations.next({annot: response, dbg: dbg});
      });
  }

  sendRequestStoredDocumentAnnotationsFromContribution(
    proposalRef: string,
    legFileName: string,
    documentRef: string,
    removeRevisionPrefix: boolean,
    dbg: number
  ) {
    return this.http
      .get<string>(
        `${apiBaseUrl}/secured/document/${legFileName}/${proposalRef}/stored-annotations/${documentRef}?removeRevisionPrefix=${removeRevisionPrefix}`,
      )
      .subscribe((response) => {
        this.receiveStoredDocumentAnnotations.next({annot: response, dbg: dbg});
      });
  }

  sendRequestStoredDocumentAnnotationsFromVersionedRef(
    proposalRef: string,
    legFileName: string,
    versionedRef: string,
    removeRevisionPrefix: boolean,
    dbg: number
  ) {
    if (legFileName) {
      return this.http
        .get<string>(
          `${apiBaseUrl}/secured/document/${proposalRef}/stored-annotations?legFileName=${legFileName}&versionedReference=${versionedRef}&removeRevisionPrefix=${removeRevisionPrefix}`,
        )
        .subscribe((response) => {
          this.receiveStoredDocumentAnnotations.next({annot: response, dbg: dbg});
        });
    } else {
      return this.http
        .get<string>(
          `${apiBaseUrl}/secured/document/${proposalRef}/stored-annotations?versionedReference=${versionedRef}&removeRevisionPrefix=${removeRevisionPrefix}`,
        )
        .subscribe((response) => {
          this.receiveStoredDocumentAnnotations.next({annot: response, dbg: dbg});
        });
    }
  }

  sendEmptyStoredDocumentAnnotations(dbg: number) {
    this.receiveStoredDocumentAnnotations.next({annot: null, dbg: dbg});
  }

  exportMilestonePdf(documentRef: string, legFileName: string, legFileId: string) {
    this.loadingService.setLoading(true);
    return this.http
      .get(
        `${apiBaseUrl}/secured/list-milestones-view/pdf-export/${documentRef}`,
        {
          params: { legFileName, legFileId },
          observe: 'response',
          responseType: 'blob',
        },
      )
      .subscribe({
        next: (response) => {
          const cd = parseContentDisposition(
            response.headers.get('Content-Disposition'),
          );
          const filename = cd.attachment
            ? cd.filename
            : `Proposal_${documentRef}.pdf`;
          downloadBlob(response.body, filename, this.document);
        },
        complete: () => this.loadingService.setLoading(false),
      });
  }

  exportMilestonePdfFromVersion(
    documentRef: string,
    versionedReference: string,
  ) {
    this.loadingService.setLoading(true);
    return this.http
      .get(
        `${apiBaseUrl}/secured/list-milestones-view-version/pdf-export/${documentRef}`,
        {
          params: { versionedReference },
          observe: 'response',
          responseType: 'blob',
        },
      )
      .subscribe({
        next: (response) => {
          const cd = parseContentDisposition(
            response.headers.get('Content-Disposition'),
          );
          const filename = cd.attachment
            ? cd.filename
            : `Proposal_${documentRef}.pdf`;
          downloadBlob(response.body, filename, this.document);
        },
        complete: () => this.loadingService.setLoading(false),
      });
  }

  downloadLegFile(legFileId: string) {
    this.loadingService.setLoading(true);
    return this.http
      .get(`${apiBaseUrl}/secured/searchlegfile/${legFileId}`, {
        observe: 'response',
        responseType: 'blob',
      })
      .subscribe({
        next: (response) => {
          const cd = parseContentDisposition(
            response.headers.get('Content-Disposition'),
          );
          const filename = cd.attachment
            ? cd.filename
            : `Proposal_${legFileId}.leg`;
          downloadBlob(response.body, filename, this.document);
        },
        complete: () => this.loadingService.setLoading(false),
      });
  }

  downloadLegFileAnyStatus(legFileId: string) {
    this.loadingService.setLoading(true);
    return this.http
      .get(`${apiBaseUrl}/secured/searchlegfile/anystatus/${legFileId}`, {
        observe: 'response',
        responseType: 'blob',
      })
      .subscribe({
        next: (response) => {
          const cd = parseContentDisposition(
            response.headers.get('Content-Disposition'),
          );
          const filename = cd.attachment
            ? cd.filename
            : `Proposal_${legFileId}.leg`;
          downloadBlob(response.body, filename, this.document);
        },
        complete: () => this.loadingService.setLoading(false),
      });
  }

  updateReadyToMergeStatus(status: string): void {
    this.readyToMergeStatusSource.next(status);
  }

  resetReadyToMergeStatus(): void {
    this.readyToMergeStatusSource.next('');
  }

  handleAccept(proposalRef: string, originalLegFileId: string, legFileName: string, isAdded: boolean, docRef: string, docCategory: string) {
    return this.http
      .get(`${apiBaseUrl}/secured/contribution/milestones/accept-doc/${proposalRef}/${docRef}/${legFileName}?isAdded=${isAdded}&originalLegFileId=${originalLegFileId}&docCategory=${docCategory}`);
  }

  handleReject(proposalRef: string, originalLegFileId: string, milestoneLegFileName: string, isAdded: boolean, docRef: string) {
    return this.http
      .get(`${apiBaseUrl}/secured/contribution/milestones/reject-doc/${proposalRef}/${docRef}/${milestoneLegFileName}?isAdded=${isAdded}&originalLegFileId=${originalLegFileId}`);
  }
}
