import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { orderBy } from 'lodash-es';
import { Observable, of } from 'rxjs';
import { isEmpty } from 'rxjs/operators';

import { Version } from '@/features/akn-document/models/versions';
import { DocumentService } from '@/shared/services/document.service';

@Component({
  selector: 'app-versions-pane-group',
  templateUrl: './versions-pane-group.component.html',
  styleUrls: ['./versions-pane-group.component.scss'],
})
export class VersionsPaneGroupComponent implements OnInit, OnChanges {
  @Input() majorVersion?: Version;
  @Input() subVersions: Version[];
  @Output() exploreMilestone = new EventEmitter<Version>();

  protected isRecent = false;
  protected isMilestone = false;
  protected isCreation = false;
  protected title: Observable<string>;
  protected subtitle: Observable<string>;
  protected description: string;
  protected showMore = false;
  protected showMoreLabel: string;
  protected hasMore = false;
  protected showVersions = false;
  protected isFilteredOut = false;
  protected displayedVersions: Version[] = [];
  protected versionsSearchResult: Version[] = [];

  private totalSubVersions = 0;

  private filter = 'all';
  private pageSize = 5;
  private semaphore = true;

  constructor(
    private translate: TranslateService,
    public docService: DocumentService,
  ) {}

  ngOnInit(): void {
    this.docService.versionFilter$.subscribe((filter) =>
      this.applyFilter(filter),
    );
    this.docService.versionSearchResults$.subscribe((results) => {
      this.docService.setVersionSearchResultsIsEmpty(results.length > 0);
      this.onVersionSearchResultsChange(results);
    });
    this.toggleShowMore(false);
    this.updateSubVersionsCount();
    this.translate.onTranslationChange.subscribe(() => this.updateState());
    if (!this.majorVersion) {
      this.docService.recentChanges$.subscribe((recentVersions: Version[]) => {
        this.subVersions = recentVersions;
        this.updateState();
      });
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (
      changes.majorVersion?.previousValue !==
        changes.majorVersion?.currentValue ||
      changes.subVersions?.previousValue !== changes.subVersions?.currentValue
    ) {
      this.updateSubVersionsCount();
      this.applyFilter();
    }
  }

  onScrollLoadData() {
    if (this.subVersions.length < this.totalSubVersions && this.semaphore) {
      this.updateState();
    }
  }

  isLatestRecentVersion(version: Version): boolean {
    return this.isRecent && this.subVersions[0] === version;
  }

  protected onSelectVersion(version: Version, inputChangeEvent: Event) {
    const checked = (inputChangeEvent.target as HTMLInputElement).checked;
    const currentVersions = this.docService.getVersionCompareIds();
    let newVersions: Version[];
    if (!checked) {
      newVersions = currentVersions.filter(
        (v) => v.documentId !== version.documentId,
      );
    } else if (currentVersions.length === 0) {
      newVersions = [version];
    } else {
      const sorted = this.sortVersions(...currentVersions);
      if (process.env.NG_APP_LEOS_INSTANCE === 'cn') {
        currentVersions.push(version);
        const sortedCN = this.sortVersions(...currentVersions);
        if (sortedCN.length === 3) {
          const minVersion = sortedCN[0];
          const medVersion = sortedCN[1];
          const maxVersion = sortedCN[2];
          newVersions = [minVersion, medVersion, maxVersion];
        } else {
          const minVersion = this.sortVersions(sorted.at(0), version)[0];
          const maxVersion = this.sortVersions(sorted.at(-1), version)[1];
          newVersions = [minVersion, maxVersion];
        }
      } else {
        const minVersion = this.sortVersions(sorted.at(0), version)[0];
        const maxVersion = this.sortVersions(sorted.at(-1), version)[1];
        newVersions = [minVersion, maxVersion];
      }
    }
    this.docService.setVersionCompareIds(newVersions);
  }

  protected isCompareCheckboxChecked(version: Version): boolean {
    const currentVersions = this.docService.getVersionCompareIds();
    return currentVersions.some((v) => v.documentId === version.documentId);
  }

  protected isCompareCheckboxDisabled(version: Version): boolean {
    const currentVersions = this.docService.getVersionCompareIds();
    if (process.env.NG_APP_LEOS_INSTANCE === 'cn') {
      return (
        currentVersions.length === 3 &&
        !currentVersions.some((v) => v.documentId === version.documentId)
      );
    } else {
      return (
        currentVersions.length === 2 &&
        !currentVersions.some((v) => v.documentId === version.documentId)
      );
    }
  }

  protected formatVersionNumber(version: Version): string {
    const { major, intermediate, minor } = version.versionNumber;
    return `${major}.${intermediate}.${minor}`;
  }

  protected formatTitle(version: Version): string {
    if (version.checkinCommentVO.checkinElement) {
      return (
        version.checkinCommentVO.checkinElement.elementLabel +
        ' ' +
        version.checkinCommentVO.checkinElement.actionType.toLowerCase()
      );
    } else {
      return version.checkinCommentVO.title;
    }
  }

  protected toggleShowMore(expanded = !this.showMore) {
    this.showMore = expanded;
    this.updateState();
  }

  private updateSubVersionsCount() {
    if (this.majorVersion) {
      this.docService
        .countIntermediateVersions(this.majorVersion)
        .subscribe((count) => {
          this.totalSubVersions = count;
          this.hasMore = this.totalSubVersions > 0;
        });
    } else {
      this.docService.countRecentChanges().subscribe((count) => {
        this.totalSubVersions = count;
        this.hasMore = this.totalSubVersions > 1;
      });
    }
  }

  private onVersionSearchResultsChange(results: Version[]) {
    this.versionsSearchResult = results;
  }

  private updateState() {
    if (this.majorVersion) {
      const { versionType, cmisVersionNumber, checkinCommentVO } =
        this.majorVersion;
      this.isMilestone = versionType === 'MAJOR';
      this.isCreation =
        versionType === 'INTERMEDIATE' && cmisVersionNumber === '1.0';
      this.description = checkinCommentVO.description;
      this.showMoreLabel = this.translate.instant(
        this.showMore
          ? 'page.editor.versions.modifications-hide'
          : 'page.editor.versions.modifications-show',
      );
      if (this.showMore && this.subVersions.length < this.totalSubVersions) {
        const self = this;
        const currentPageIndex = Math.floor(
          this.subVersions.length / this.pageSize,
        );
        this.semaphore = false;
        this.docService
          .getIntermediateVersions(
            this.majorVersion,
            currentPageIndex,
            this.pageSize,
          )
          .subscribe({
            next: (versions) => {
              self.subVersions = [...self.subVersions, ...versions];
              self.displayedVersions = self.showMore ? self.subVersions : [];
              self.semaphore = true;
            },
          });
      } else {
        this.displayedVersions = this.showMore ? this.subVersions : [];
      }
      this.showVersions = this.showMore;
      this.hasMore = this.totalSubVersions > 0;
    } else {
      this.isRecent = true;
      this.showVersions = true;
      this.showMoreLabel = this.translate.instant(
        this.showMore
          ? 'page.editor.versions.show-less'
          : 'page.editor.versions.show-more',
      );
      if (this.showMore && this.subVersions.length < this.totalSubVersions) {
        const self = this;
        const currentPageIndex = Math.floor(
          this.subVersions.length / this.pageSize,
        );
        self.semaphore = false;
        this.docService
          .getDocumentRecentChangesData(
            this.docService.documentType,
            this.docService.documentRef,
            currentPageIndex,
            this.pageSize,
          )
          .subscribe({
            next: (versions) => {
              if (self.subVersions.length === 1) {
                self.subVersions = [...versions];
              } else {
                self.subVersions = [...self.subVersions, ...versions];
              }
              self.displayedVersions = self.showMore
                ? self.subVersions
                : [self.subVersions[0]];
              self.semaphore = true;
            },
          });
      } else if (this.subVersions.length > 0) {
        this.displayedVersions = this.showMore
          ? this.subVersions
          : [this.subVersions[0]];
      } else {
        this.displayedVersions = this.subVersions;
      }
      this.hasMore = this.totalSubVersions > 1;
    }

    this.title = this.getTitle();
    this.subtitle = this.getSubtitle();
    const currentVersions = this.docService.getVersionCompareIds();
    if (
      this.isRecent &&
      this.subVersions.length > 0 &&
      currentVersions.length > 0
    ) {
      const sortedCurrentVersions = this.sortVersions(...currentVersions);
      const maxSortedVersion = this.sortVersions(
        sortedCurrentVersions.at(-1),
        sortedCurrentVersions[0],
      )[1];
      const maxVersion =
        this.subVersions.length > 1
          ? this.subVersions.filter(
              (v) => v.documentId === maxSortedVersion.documentId,
            )[0]
          : maxSortedVersion;
      const checkbox = document.getElementById(
        `select-${maxVersion.documentId}`,
      ) as HTMLInputElement;
      checkbox.checked = false;
      checkbox.dispatchEvent(new Event('change'));
      this.onSelectVersion(maxVersion, {
        target: { checked: false },
      } as any);
      this.onSelectVersion(this.subVersions[0], {
        target: { checked: true },
      } as any);
    }
  }

  private applyFilter(filter = this.filter) {
    const filters = ['all'];
    if (!this.isRecent) {
      filters.push(this.isMilestone ? 'milestone' : 'save');
    }
    this.isFilteredOut = !filters.includes(filter);
  }

  private getTitle() {
    return this.isRecent
      ? this.translate.get('page.editor.versions.group-recents-title')
      : this.translate.get('page.editor.versions.group-title', {
          version: this.formatVersionNumber(this.majorVersion),
          title: this.majorVersion.checkinCommentVO.title,
        });
  }

  private getSubtitle() {
    if (!this.isRecent) {
      return of(
        `${this.majorVersion.updatedDate} ${this.majorVersion.createdBy}`,
      );
    } else if (this.subVersions.length) {
      return this.translate.get('page.editor.versions.group-recents-subtitle', {
        date: this.subVersions[0].updatedDate,
      });
    } else {
      return this.translate.get(
        'page.editor.versions.group-recents-subtitle-empty',
      );
    }
  }

  private sortVersions(...versions: Version[]): Version[] {
    return orderBy(versions, [
      (v) => v.versionNumber.major,
      (v) => v.versionNumber.intermediate,
      (v) => v.versionNumber.minor,
    ]);
  }
}
