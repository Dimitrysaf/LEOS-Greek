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
  protected versions: Version[] = [];
  protected isFilteredOut = false;

  private filter = 'all';

  constructor(
    private translate: TranslateService,
    public docService: DocumentService,
  ) {}

  ngOnInit(): void {
    this.docService.versionFilter$.subscribe((filter) =>
      this.applyFilter(filter),
    );
    this.toggleShowMore(false);
    this.translate.onTranslationChange.subscribe(() => this.updateState());
  }

  ngOnChanges(changes: SimpleChanges) {
    if (
      changes.majorVersion?.previousValue !==
        changes.majorVersion?.currentValue ||
      changes.subVersions?.previousValue !== changes.subVersions?.currentValue
    ) {
      this.updateState();
      this.applyFilter();
    }
  }

  isLatestRecentVersion(version: Version): boolean {
    return this.isRecent && this.versions[0] === version;
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
      const minVersion = this.sortVersions(sorted.at(0), version)[0];
      const maxVersion = this.sortVersions(sorted.at(-1), version)[1];
      newVersions = [minVersion, maxVersion];
    }

    this.docService.setVersionCompareIds(newVersions);
  }

  protected isCompareCheckboxChecked(version: Version): boolean {
    const currentVersions = this.docService.getVersionCompareIds();
    return currentVersions.some((v) => v.documentId === version.documentId);
  }

  protected isCompareCheckboxDisabled(version: Version): boolean {
    const currentVersions = this.docService.getVersionCompareIds();
    return (
      currentVersions.length === 2 &&
      !currentVersions.some((v) => v.documentId === version.documentId)
    );
  }

  protected formatVersionNumber(version: Version): string {
    const { major, intermediate, minor } = version.versionNumber;
    return `${major}.${intermediate}.${minor}`;
  }

  protected toggleShowMore(expanded = !this.showMore) {
    this.showMore = expanded;
    this.updateState();
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
      this.versions = this.showMore ? this.subVersions : [];
      this.hasMore = this.subVersions.length > 0;
    } else {
      this.isRecent = true;
      this.showMoreLabel = this.translate.instant(
        this.showMore
          ? 'page.editor.versions.show-less'
          : 'page.editor.versions.show-more',
      );
      this.versions = this.showMore
        ? this.subVersions
        : [this.subVersions[0]].filter(Boolean);
      this.hasMore = this.subVersions.length > 1;
    }

    this.title = this.getTitle();
    this.subtitle = this.getSubtitle();
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
