import { DOCUMENT } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import {
  BehaviorSubject,
  combineLatest,
  distinctUntilChanged,
  map,
  Observable,
  of,
  switchMap,
  take,
  tap,
} from 'rxjs';

import { Version } from '@/features/akn-document/models';
import {
  PageMode,
  PageModeService,
} from '@/features/akn-document/services/page-mode.service';
import { SyncDocumentScrollService } from '@/features/akn-document/services/sync-document-scroll.service';
import {
  DocumentRefAndCategory,
  DocumentService,
} from '@/shared/services/document.service';
import { EnvironmentService } from '@/shared/services/enviroment.service';
import { ZoombarService } from '@/shared/services/zoombar.service';
import { parentHasClass } from '@/shared/utils';

import { apiBaseUrl } from '../../../../config';

const compareClasses = [
  'leos-content-removed',
  'leos-content-removed-cn',
  'leos-content-new',
  'leos-content-new-cn',
  'leos-double-compare-removed',
  'leos-double-compare-added',
];

@Injectable({
  providedIn: 'root',
})
export class VersionCompareService {
  versionCompareView$: Observable<string>;
  versionsComparisonForViewHeaderTitle$: Observable<string>;
  versionCompareIds$: Observable<Version[]>;
  compareModeEnabled$: Observable<boolean>;
  hasPrevChangesDisabled$: Observable<boolean>;
  hasNextChangeDisabled$: Observable<boolean>;

  private navigationAnchorIndex2 = 0;
  private compareChanges: NodeListOf<HTMLElement>;
  private navigationAnchorsList: HTMLElement[];
  private arrowClicked = false;

  private versionComparisonViewBS = new BehaviorSubject<string>(null);
  private versionCompareIdsBS = new BehaviorSubject<Version[]>([]);
  private compareModeEnabledBS = new BehaviorSubject<boolean>(false);
  private hasNextChangeDisabledBS = new BehaviorSubject<boolean>(true);
  private hasPrevChangesDisabledBS = new BehaviorSubject<boolean>(true);

  constructor(
    protected documentService: DocumentService,
    protected syncScrollService: SyncDocumentScrollService,
    protected http: HttpClient,
    protected environmentService: EnvironmentService,
    protected translateService: TranslateService,
    protected zoombarService: ZoombarService,
    @Inject(DOCUMENT) protected document: Document,
    private pageModeService: PageModeService,
  ) {
    this.versionCompareIds$ = this.versionCompareIdsBS.asObservable();
    this.versionCompareView$ = this.versionComparisonViewBS.asObservable();
    this.compareModeEnabled$ = this.compareModeEnabledBS.asObservable();
    this.hasPrevChangesDisabled$ = this.hasPrevChangesDisabledBS.asObservable();
    this.hasNextChangeDisabled$ = this.hasNextChangeDisabledBS.asObservable();

    this.versionCompareView$ = combineLatest([
      this.versionCompareIds$,
      this.documentService.documentRefAndCategory$,
    ]).pipe(
      switchMap(([versionsToCompare, documentOptions]) =>
        this.handleComparisonSelectedVersion(
          versionsToCompare,
          documentOptions,
        ),
      ),
      tap((compared) => compared && this.initCompareView()),
    );

    this.versionsComparisonForViewHeaderTitle$ = combineLatest([
      this.versionCompareIds$,
    ]).pipe(
      distinctUntilChanged(),
      map(([versions]) => this.getVersionComparisonViewHeaderTitle(versions)),
    );
  }

  toggleSyncScroll() {
    const current = this.syncScrollService.isSyncScrollEnabled;
    this.syncScrollService.setSyncScroll(!current);
  }

  setVersionCompareIds(versions: Version[]) {
    this.versionCompareIdsBS.next(versions);
  }

  getVersionCompareIds() {
    return this.versionCompareIdsBS.value;
  }

  downloadXmlFile() {
    this.versionCompareIds$.pipe(take(1)).subscribe((versions) => {
      this.documentService.compareDocumentsDownloadXML(
        versions[1],
        versions[0],
        this.getIntermediateVersion(versions),
      );
    });
  }

  downloadPdfFile() {
    this.versionCompareIds$.pipe(take(1)).subscribe((versions) => {
      this.documentService.compareDocumentsExportAsPdf(
        versions[1],
        versions[0],
        this.getIntermediateVersion(versions),
      );
    });
  }

  downloadVersionOfFile() {
    this.versionCompareIds$.pipe(take(1)).subscribe((versions) => {
      this.documentService.compareDocumentsDownloadDocuwrite(
        versions[1],
        versions[0],
        this.getIntermediateVersion(versions),
      );
    });
  }

  handlePrevChange() {
    if (this.navigationAnchorIndex2 >= 0) {
      // this.isScrollFromButton = true;
      // const filteredParents = this.getFilteredParents();
      const prevIndex =
        this.navigationAnchorIndex2 - 1 < 0
          ? 0
          : this.navigationAnchorIndex2 - 1;
      const targetElement = this.navigationAnchorsList[prevIndex];
      requestAnimationFrame(() => {
        // Scroll the target element into view
        targetElement.scrollIntoView({
          block: 'start',
        });
      });

      setTimeout(() => {
        this.syncScrollService.syncScrollByNavigationChange(targetElement);
      });
      this.navigationAnchorIndex2--;
      this.arrowClicked = true;
    }
    this.checkHandleNavCompareBtnDisabled();
  }

  handleNextChange() {
    if (
      this.navigationAnchorIndex2 !== this.navigationAnchorsList.length - 1 &&
      this.navigationAnchorsList.length > 0
    ) {
      const targetElement =
        this.navigationAnchorsList[this.navigationAnchorIndex2 + 1];
      requestAnimationFrame(() => {
        // Scroll the target element into view
        targetElement.scrollIntoView({
          block: 'start',
        });
      });

      setTimeout(() => {
        this.syncScrollService.syncScrollByNavigationChange(targetElement);
      });

      this.navigationAnchorIndex2++;
      this.arrowClicked = true;
    }
    this.checkHandleNavCompareBtnDisabled();
  }

  clearVersionComparisonView() {
    this.compareChanges = null;
    this.navigationAnchorsList = [];
    this.navigationAnchorIndex2 = 0;
    this.removeAllPins();
  }

  closeVersionComparisonView() {
    this.clearVersionComparisonView();
    this.zoombarService.resetAllZoomLevels();
    this.versionCompareIdsBS.next([]);
    this.versionComparisonViewBS.next(null);
    this.compareModeEnabledBS.next(false);
    this.syncScrollService.setSyncScroll(false);
    this.pageModeService.setPageMode(PageMode.Normal);
  }

  toggleCompareMode() {
    const nextValue = !this.compareModeEnabledBS.value;
    this.compareModeEnabledBS.next(nextValue);
    if (nextValue) this.pageModeService.setPageMode(PageMode.CompareVersions);
    if (!nextValue) {
      this.closeVersionComparisonView();
    }
  }

  private initCompareView() {
    this.syncScrollService.setSyncScroll(true);

    setTimeout(() => {
      this.handleCompareChanges();
      this.checkHandleNavCompareBtnDisabled();
    });
  }

  private handleCompareChanges() {
    this.navigationAnchorIndex2 = 0;
    const nodeListCN = document.querySelectorAll(
      '.leos-content-new-cn:not(num), .leos-content-removed-cn:not(num)',
    );
    const nodeList = document.querySelectorAll(
      '.leos-content-new:not(num), .leos-content-removed:not(num)',
    );
    const nodeListCNDoubleCompare = document.querySelectorAll(
      '.leos-double-compare-removed:not(num), .leos-double-compare-added:not(num)',
    );
    this.compareChanges = (
      nodeList && nodeList.length > 0
        ? nodeList
        : nodeListCN && nodeListCN.length > 0
        ? nodeListCN
        : nodeListCNDoubleCompare
    ) as NodeListOf<HTMLElement>;
    const container = this.document.getElementById(
      'versionComparisonContainer',
    );
    if (!container) return;
    this.handlePins(container);
    this.getNavigationAnchors();
  }

  private handleComparisonSelectedVersion(
    versionsToCompare: Version[],
    docentOptions: DocumentRefAndCategory,
  ) {
    if (versionsToCompare.length > 2) {
      return this.getDocumentVersionsDoubleComparison(
        docentOptions.ref,
        docentOptions.category,
        versionsToCompare[2],
        versionsToCompare[1] !== undefined ? versionsToCompare[1] : null,
        versionsToCompare[0],
      );
    }

    if (versionsToCompare.length === 2) {
      return this.getDocumentVersionsSimpleComparison(
        docentOptions.ref,
        docentOptions.category,
        versionsToCompare[1],
        versionsToCompare[0],
      );
    }

    if (versionsToCompare && versionsToCompare.length === 0) {
      this.clearVersionComparisonView();
    }
    return of(null);
  }

  private checkHandleNavCompareBtnDisabled() {
    this.hasNextChangeDisabledBS.next(
      this.navigationAnchorIndex2 === this.navigationAnchorsList.length - 1,
    );
    this.hasPrevChangesDisabledBS.next(this.navigationAnchorIndex2 === 0);
  }

  private handlePins(container: HTMLElement) {
    const pinContainer = this.document.createElement('div');
    pinContainer.classList.add('pin-container');
    pinContainer.classList.add('pin-right');
    container.parentElement.appendChild(pinContainer);
    const selectorStyleMap = {
      '.leos-marker-content-removed': 'pin-leos-marker-content-removed',
      '.leos-marker-content-added': 'pin-leos-marker-content-added',
      '.leos-content-removed': 'pin-leos-content-removed',
      '.leos-content-removed-cn': 'pin-leos-content-removed',
      '.leos-content-new': 'pin-leos-content-new',
      '.leos-content-new-cn': 'pin-leos-content-new',
      '.leos-double-compare-removed': 'pin-leos-marker-content-removed',
      '.leos-double-compare-added': 'pin-leos-marker-content-added',
    };
    this.addPins(container, pinContainer, selectorStyleMap);
  }

  private addPins(
    target: HTMLElement,
    pinContainer: HTMLElement,
    selectorStyleMap: { [key: string]: string },
  ): HTMLElement[] {
    this.removeAllPins();
    const pins: HTMLElement[] = [];
    Object.keys(selectorStyleMap).forEach((selector) => {
      const elements = target.querySelectorAll(selector);
      elements.forEach((el, elIndex) => {
        const pinElement = this.createPin(
          pins.length + 1,
          el as HTMLElement,
          selectorStyleMap[selector],
          target,
        );
        if (this.uniquePin(pins, pinElement)) {
          this.attachTo(pinContainer, pinElement);
          pins.push(pinElement);
        }
      });
    });
    return pins;
  }

  private uniquePin(pins: HTMLElement[], el: HTMLElement): boolean {
    const top = el.style.top;
    const className = el.className;
    return pins.every(
      (pin) => top !== pin.style.top || className !== pin.className,
    );
  }

  private getPercentageDistanceFromTop(
    element: HTMLElement,
    target: HTMLElement,
  ): string {
    const totalHeight = target.scrollHeight;
    const elementPosFromTargetTop = this.getElementDistanceFromTop(
      element,
      target,
    );
    return `${((100 * elementPosFromTargetTop) / totalHeight).toFixed(2)}%`;
  }

  private _roundOffTo(floatNumber, digitsAfterDecimal) {
    return floatNumber.toFixed(digitsAfterDecimal);
  }

  private addClass(el: HTMLElement, className: string) {
    if (el.classList) {
      el.classList.add(className);
    } else {
      el.className += ` ${className}`;
    }
  }

  private attachTo(container: HTMLElement, el: HTMLElement) {
    container.appendChild(el);
  }

  private createPin(
    index: number,
    refToElement: HTMLElement,
    pinStyle: string,
    target: HTMLElement,
  ): HTMLElement {
    const pinDiv = document.createElement('div');
    this.addClass(pinDiv, 'pin');
    this.addClass(pinDiv, pinStyle);
    pinDiv.setAttribute('data-index', index.toString());
    pinDiv.setAttribute('ref-to', refToElement.id); // add custom attribute
    pinDiv.style.top = this.getPercentageDistanceFromTop(refToElement, target);
    pinDiv.addEventListener('click', () =>
      this.scrollToChange(refToElement, target),
    );
    return pinDiv;
  }

  private scrollToChange(el: HTMLElement, target: HTMLElement) {
    const topOffset = this.getElementDistanceFromTop(el, target) - 106;
    target.scrollTop = topOffset;
  }

  private removeAllPins() {
    const pins = document.querySelectorAll('.pin-container .pin');
    pins.forEach((pin) => pin.remove());
  }

  private getElementDistanceFromTop(
    el: HTMLElement,
    target: HTMLElement,
  ): number {
    let distance = 0;
    while (el && el !== target) {
      if (el.hidden) el = el.parentElement;
      else {
        distance += el.offsetTop;
        el = el.offsetParent as HTMLElement;
      }
    }
    return distance;
  }

  private getNavigationAnchors() {
    const navigationAnchors: HTMLElement[] = [];
    this.compareChanges.forEach((elem) => {
      if (elem.tagName.toLowerCase() === 'span') {
        if (!parentHasClass(elem, compareClasses)) {
          if (
            !navigationAnchors.find(
              (element) => element.id === elem.parentElement.id,
            )
          ) {
            navigationAnchors.push(elem.parentElement);
          }
        }
        if (
          parentHasClass(elem, compareClasses) &&
          !parentHasClass(elem.parentElement, compareClasses)
        ) {
          if (
            !navigationAnchors.find(
              (element) => element.id === elem.parentElement.id,
            )
          ) {
            navigationAnchors.push(elem.parentElement);
          }
        }

        if (
          parentHasClass(elem, compareClasses) &&
          parentHasClass(elem.parentElement, compareClasses) &&
          !parentHasClass(elem.parentElement.parentElement, compareClasses)
        ) {
          if (
            !navigationAnchors.find(
              (element) => element.id === elem.parentElement.parentElement.id,
            )
          ) {
            navigationAnchors.push(elem.parentElement.parentElement);
          }
        }
        if (
          parentHasClass(elem, compareClasses) &&
          parentHasClass(elem.parentElement, compareClasses) &&
          parentHasClass(elem.parentElement.parentElement, compareClasses) &&
          !parentHasClass(
            elem.parentElement.parentElement.parentElement,
            compareClasses,
          )
        ) {
          if (
            !navigationAnchors.find(
              (element) =>
                element.id ===
                elem.parentElement.parentElement.parentElement.id,
            )
          ) {
            navigationAnchors.push(
              elem.parentElement.parentElement.parentElement,
            );
          }
        }
      } else {
        navigationAnchors.push(elem);
      }
    });
    this.navigationAnchorsList = navigationAnchors;
  }

  private getFilteredParents(): HTMLElement[] {
    const filteredParents: HTMLElement[] = [];
    this.compareChanges.forEach((change) => {
      const parent = change.parentElement;
      if (
        parent &&
        !parent.classList.contains('leos-content-new-cn') &&
        !parent.classList.contains('leos-content-removed-cn') &&
        !parent.classList.contains('leos-content-new') &&
        !parent.classList.contains('leos-content-removed') &&
        !parent.classList.contains('leos-double-compare-removed') &&
        !parent.classList.contains('leos-double-compare-added')
      ) {
        filteredParents.push(parent);
      }
    });
    return filteredParents;
  }

  private getDocumentVersionsDoubleComparison(
    documentRef: string,
    documentType: string,
    newVersion: Version,
    intermediateVersion: Version,
    oldVersion: Version,
  ) {
    documentType = documentType === 'coverpage' ? 'coverPage' : documentType;
    //TODO : We should split logic for CN instnaces on services to DocumentServiceMandate (Council) && DocumentServiceProposal (Commision) see the proposed MR for more
    if (
      process.env.NG_APP_LEOS_INSTANCE === 'cn' &&
      intermediateVersion !== null
    ) {
      return this.http.post<string>(
        `${apiBaseUrl}/secured/document/double-compare/${documentType}/${documentRef}`,
        {
          originalProposalId: this.getVersionReferenceString(oldVersion),
          intermediateMajorId:
            this.getVersionReferenceString(intermediateVersion) ?? null,
          currentId: this.getVersionReferenceString(newVersion),
        },
        { responseType: 'text' as 'json' },
      );
    }
  }

  private getDocumentVersionsSimpleComparison(
    documentRef: string,
    documentType: string,
    newVersion: Version,
    oldVersion: Version,
  ) {
    documentType = documentType === 'coverpage' ? 'coverPage' : documentType;
    //TODO : We should split logic for CN instnaces on services to DocumentServiceMandate (Council) && DocumentServiceProposal (Commision) see the proposed MR for more
    return this.http.get<string>(
      `${apiBaseUrl}/secured/${documentType}/${newVersion.documentId}/compare/${oldVersion.documentId}`,
      { responseType: 'text' as 'json' },
    );
  }

  private getVersionReferenceString(v: Version): string {
    return v
      ? `${v.versionNumber.major}.${v.versionNumber.intermediate}.${v.versionNumber.minor}`
      : null;
  }

  private getIntermediateVersion(versions): Version {
    if (this.environmentService.isCouncil() && versions.length === 3) {
      return versions[2];
    }
    return null;
  }

  private getVersionComparisonViewHeaderTitle(versions: Version[]) {
    if (this.environmentService.isCouncil()) {
      if (versions.length === 2) {
        return this.translateService.instant('version.compare.header', {
          oldVersion: this.formatVersionNumber(versions[0]),
          newVersion: this.formatVersionNumber(versions[1]),
        });
      }
      if (versions.length === 3) {
        return this.translateService.instant('version.double.compare.header', {
          oldestVersion: this.formatVersionNumber(versions[0]),
          newVersion: this.formatVersionNumber(versions[1]),
          newestVersion: this.formatVersionNumber(versions[2]),
        });
      } else {
        return this.translateService.instant(
          'version.compare.header.default.cn',
        );
      }
    } else {
      return versions.length === 2
        ? this.translateService.instant('version.compare.header', {
            oldVersion: this.formatVersionNumber(versions[0]),
            newVersion: this.formatVersionNumber(versions[1]),
          })
        : this.translateService.instant('version.compare.header.default');
    }
  }

  private formatVersionNumber(version: Version): string {
    const { major, intermediate, minor } = version.versionNumber;
    return `${major}.${intermediate}.${minor}`;
  }
}
